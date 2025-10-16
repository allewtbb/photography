import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Upload as UploadIcon, Image as ImageIcon } from "lucide-react";
import { Link } from "wouter";
import type { Collection } from "@shared/schema";

export default function Admin() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", coverImageUrl: "" });
  const [uploadingCover, setUploadingCover] = useState(false);
  const { toast } = useToast();

  const { data: collections = [], isLoading } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiRequest("/api/collections", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      setIsCreating(false);
      setFormData({ title: "", description: "", coverImageUrl: "" });
      toast({ title: "Collection created successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof formData }) =>
      apiRequest(`/api/collections/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      setEditingId(null);
      setFormData({ title: "", description: "", coverImageUrl: "" });
      toast({ title: "Collection updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/collections/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      toast({ title: "Collection deleted successfully" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (collection: Collection) => {
    setEditingId(collection.id);
    setFormData({
      title: collection.title,
      description: collection.description || "",
      coverImageUrl: collection.coverImageUrl || "",
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ title: "", description: "", coverImageUrl: "" });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setFormData((prev) => ({ ...prev, coverImageUrl: data.imageUrl }));
      toast({ title: "Cover image uploaded successfully" });
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploadingCover(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-light tracking-tighter mb-2">
              Admin Panel
            </h1>
            <p className="text-muted-foreground text-lg font-light">
              Manage your photography collections
            </p>
          </div>
          <Button
            onClick={() => setIsCreating(!isCreating)}
            className="gap-2"
            data-testid="button-new-collection"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </Button>
        </div>

        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-light tracking-tight">
                {editingId ? "Edit Collection" : "Create New Collection"}
              </CardTitle>
              <CardDescription>
                {editingId ? "Update collection details" : "Add a new photography collection"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Collection title"
                    required
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Collection description"
                    rows={3}
                    data-testid="input-description"
                  />
                </div>
                <div>
                  <Label>Cover Image</Label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        disabled={uploadingCover}
                        data-testid="input-cover-image"
                      />
                    </div>
                    {formData.coverImageUrl && (
                      <img
                        src={formData.coverImageUrl}
                        alt="Cover preview"
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {editingId ? "Update" : "Create"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} data-testid="button-cancel">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading collections...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card key={collection.id} data-testid={`card-collection-${collection.id}`}>
                <CardHeader>
                  {collection.coverImageUrl && (
                    <img
                      src={collection.coverImageUrl}
                      alt={collection.title}
                      className="w-full h-32 object-cover rounded-md mb-4"
                    />
                  )}
                  <CardTitle className="font-light tracking-tight">{collection.title}</CardTitle>
                  <CardDescription>{collection.description || "No description"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/admin/collection/${collection.id}`}>
                      <Button variant="outline" size="sm" className="gap-2" data-testid={`button-manage-${collection.id}`}>
                        <UploadIcon className="w-4 h-4" />
                        Manage Photos
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(collection)}
                      data-testid={`button-edit-${collection.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(collection.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${collection.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
