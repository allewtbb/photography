import MasonryGrid from "../MasonryGrid";
import mountainImg from "@assets/generated_images/Misty_mountain_landscape_photography_2d6bcfb0.png";
import architectureImg from "@assets/generated_images/Minimalist_architectural_photography_ec3b2d9c.png";
import coastalImg from "@assets/generated_images/Coastal_seascape_photography_15f7a334.png";
import urbanImg from "@assets/generated_images/Urban_street_photography_0c172feb.png";
import portraitImg from "@assets/generated_images/Natural_light_portrait_photography_eabe2f91.png";
import abstractImg from "@assets/generated_images/Abstract_nature_texture_photography_1bd0658d.png";

export default function MasonryGridExample() {
  const photos = [
    { id: "1", src: mountainImg, alt: "Mountain landscape" },
    { id: "2", src: architectureImg, alt: "Architecture" },
    { id: "3", src: coastalImg, alt: "Coastal scene" },
    { id: "4", src: urbanImg, alt: "Urban street" },
    { id: "5", src: portraitImg, alt: "Portrait" },
    { id: "6", src: abstractImg, alt: "Abstract texture" },
  ];

  return (
    <div className="p-8">
      <MasonryGrid photos={photos} />
    </div>
  );
}
