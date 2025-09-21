import Navbar from "@/components/Navbar";
import ImageUploadZone from "@/components/ImageUploadZone";
import ProcessingHistory from "@/components/ProcessingHistory";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <ImageUploadZone />
        <ProcessingHistory />
      </div>
    </div>
  );
};

export default Index;
