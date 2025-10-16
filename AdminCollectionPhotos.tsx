import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Upload as UploadIcon } from "lucide-react";
import type { Collection, Photo } from "@shared/schema";

export default function AdminCollectionPhotos() {
  const [, params] = useRoute("/admin/collection/:id");
  const collectionId = params?.id || "";
  const [uploading, setUploading] = useState(false);
  const [photoData, setPhotoData] = useState({ imageUrl: "", alt: "", aspectRatio: "" });
  const { toast } = useToast();

  const { data: collection } = useQuery<Collection>({
    queryKey: ["/api/collections", collectionId],
    enabled: !!collectionId,
  });

  const { data: photos = [], isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/collections", collectionId, "photos"],
    enabled: !!collectionId,
  });

  const uploadMutation = useMutation({
    mutationFn: (data: typeof photoData) =>
      apiRequest("/api/photos", "POST", { ...data, collectionId, order: photos.length }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections", collectionId, "photos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/photo-counts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      setPhotoData({ imageUrl: "", alt: "", aspectRatio: "" });
      toast({ title: "Photo added successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/photos/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections", collectionId, "photos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/photo-counts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ title: "Photo deleted successfully" });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      // Get image dimensions to calculate aspect ratio
      const img = new Image();
      img.onload = () => {
        const aspectRatio = `${img.width}/${img.height}`;
        setPhotoData((prev) => ({ 
          ...prev, 
          imageUrl: data.imageUrl,
          aspectRatio,
          alt: prev.alt || file.name.replace(/\.[^/.]+$/, "")
        }));
      };
      img.src = data.imageUrl;
      
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoData.imageUrl) {
      toast({ title: "Please upload an image", variant: "destructive" });
      return;
    }
    uploadMutation.mutate(photoData);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Link 
          href="/admin"
          className="inline-flex items-center gap-2 text-muted-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md mb-8 transition-colors" 
          data-testid="link-back-admin"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-light">Back to Admin</span>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tighter mb-2">
            {collection?.title || "Collection Photos"}
          </h1>
          <p className="text-muted-foreground text-lg font-light">
            Upload and manage photos for this collection
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-light tracking-tight">Add New Photo</CardTitle>
            <CardDescription>Upload a photo to this collection</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  data-testid="input-image"
                />
                {photoData.imageUrl && (
                  <img
                    src={photoData.imageUrl}
                    alt="Preview"
                    className="mt-4 max-w-xs rounded-md"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  id="alt"
                  value={photoData.alt}
                  onChange={(e) => setPhotoData({ ...photoData, alt: e.target.value })}
                  placeholder="Describe the image"
                  required
                  data-testid="input-alt"
                />
              </div>
              <Button
                type="submit"
                disabled={uploadMutation.isPending || uploading || !photoData.imageUrl}
                className="gap-2"
                data-testid="button-add-photo"
              >
                <UploadIcon className="w-4 h-4" />
                Add Photo
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading photos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} data-testid={`card-photo-${photo.id}`}>
                <CardHeader className="p-0">
                  <img
                    src={photo.imageUrl}
                    alt={photo.alt}
                    className="w-full h-48 object-cover rounded-t-md"
                  />
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">{photo.alt}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(photo.id)}
                    disabled={deleteMutation.isPending}
                    className="gap-2"
                    data-testid={`button-delete-${photo.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
