import { Router } from "wouter";
import CollectionCard from "../CollectionCard";
import mountainImg from "@assets/generated_images/Misty_mountain_landscape_photography_2d6bcfb0.png";

export default function CollectionCardExample() {
  return (
    <Router>
      <div className="p-8 max-w-md">
        <CollectionCard
          id="landscapes"
          title="Landscapes"
          coverImage={mountainImg}
          photoCount={24}
          description="Mountain ranges and natural vistas"
        />
      </div>
    </Router>
  );
}
