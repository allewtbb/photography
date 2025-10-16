import PhotoGrid from "../PhotoGrid";
import mountainImg from "@assets/generated_images/Misty_mountain_landscape_photography_2d6bcfb0.png";
import architectureImg from "@assets/generated_images/Minimalist_architectural_photography_ec3b2d9c.png";
import coastalImg from "@assets/generated_images/Coastal_seascape_photography_15f7a334.png";

export default function PhotoGridExample() {
  const photos = [
    { id: "1", src: mountainImg, alt: "Mountain landscape", aspectRatio: "16/9" },
    { id: "2", src: architectureImg, alt: "Architecture", aspectRatio: "3/4" },
    { id: "3", src: coastalImg, alt: "Coastal scene", aspectRatio: "16/9" },
  ];

  return (
    <div className="p-8">
      <PhotoGrid photos={photos} columns={3} />
    </div>
  );
}
