import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Sparkles, Download, Eye, Trash2, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  imageId?: string; // Backend image ID
  enhanced?: string[];
  status: 'uploaded' | 'submitting' | 'submitted' | 'processing' | 'completed';
  progress?: number;
}

const ImageUploadZone = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const newImage: UploadedImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        status: 'uploaded',
      };
      
      setImages(prev => [...prev, newImage]);
      
      toast({
        title: "Image uploaded successfully",
        description: `${file.name} is ready for enhancement`,
      });
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    multiple: true
  });

  // --- Upload Image to Backend ---
  const handleSubmit = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    setImages(prev => prev.map(img => img.id === imageId ? { ...img, status: 'submitting' } : img));

    const formData = new FormData();
    formData.append("image", image.file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, status: 'submitted', imageId: res.data.id } : img
      ));

      toast({
        title: "Image uploaded successfully!",
        description: res.data.message || "Image is ready for beautification",
      });

    } catch (err) {
      console.error(err);
      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, status: 'uploaded' } : img
      ));

      toast({
        title: "Upload failed",
        description: "Failed to upload image to server",
        variant: "destructive",
      });
    }
  };

  // --- Beautify Image ---
  const handleBeautify = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image || !image.imageId) {
      toast({
        title: "Please submit image first",
        description: "Image must be uploaded before beautification",
        variant: "destructive",
      });
      return;
    }

    setImages(prev => prev.map(img => img.id === imageId ? { ...img, status: 'processing', progress: 0 } : img));

    let progressInterval: NodeJS.Timeout;
    try {
      // Simulate progress
      progressInterval = setInterval(() => {
        setImages(prev => prev.map(img => {
          if (img.id === imageId && img.status === "processing") {
            const newProgress = Math.min((img.progress || 0) + Math.random() * 10, 90);
            return { ...img, progress: newProgress };
          }
          return img;
        }));
      }, 300);

      const res = await axios.post(`http://localhost:5000/beautify/${image.imageId}`, {
        imageId: image.imageId
      }, { headers: { "Content-Type": "application/json" } });

      clearInterval(progressInterval);

      if (res.data?.image) {
        setImages(prev => prev.map(img =>
          img.id === imageId ? { ...img, status: "completed", progress: 100, enhanced: [res.data.image] } : img
        ));

        toast({
          title: "Enhancement completed!",
          description: `Generated 1 enhanced image`,
        });
      } else {
        throw new Error("No images received from server");
      }

    } catch (err: any) {
      console.error("Beautify request failed:", err.message || err);
      clearInterval(progressInterval);
      setImages(prev => prev.map(img => img.id === imageId ? { ...img, status: "submitted" } : img));
      toast({
        title: "Enhancement failed",
        description: err.message || "Failed to process image",
        variant: "destructive",
      });
    }
  };

  // --- Preview Result ---
  const handlePreview = (enhanced: string[]) => {
    if (!enhanced || enhanced.length === 0) return;
    window.open(enhanced[0], "_blank");
  };

  // --- Download All ---
  const handleDownloadAll = (enhanced: string[]) => {
    if (!enhanced || enhanced.length === 0) return;
    enhanced.forEach((base64, index) => {
      const link = document.createElement("a");
      link.href = base64;
      link.download = `enhanced_${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleRemove = (imageId: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.preview);
      return prev.filter(img => img.id !== imageId);
    });
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Transform Your Product Images with
          <span className="bg-gradient-primary bg-clip-text text-transparent ml-2">
            AI Magic
          </span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Upload any image and watch our advanced AI enhance it with professional-grade beautification, 
          color correction, and detail enhancement.
        </p>
      </div>

      {/* Upload Zone */}
      <Card className={`border-2 border-dashed transition-all duration-normal ${isDragActive ? 'border-primary bg-primary/5 shadow-primary' : 'border-border hover:border-primary/50'}`}>
        <CardContent className="p-8">
          <div {...getRootProps()} className="cursor-pointer text-center">
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-full transition-all duration-normal ${isDragActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <Upload className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {isDragActive ? 'Drop your images here!' : 'Upload Your Product Images'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop or click to select images for AI enhancement
                </p>
                <Button variant="outline" className="mx-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Supports: JPG, PNG, WebP, GIF • Max size: 10MB per image
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Your Images</h2>
          <div className="grid gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Original Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted">
                        <img src={image.preview} alt="Original" className="w-full h-full object-cover" />
                        <Badge className="absolute top-1 left-1 text-xs">Original</Badge>
                      </div>
                    </div>

                    {/* Info & Actions */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-foreground truncate">{image.file.name}</h3>
                          <p className="text-sm text-muted-foreground">{(image.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            image.status === 'completed' ? 'default' :
                            image.status === 'processing' ? 'secondary' : 
                            image.status === 'submitted' ? 'outline' :
                            image.status === 'submitting' ? 'secondary' : 'outline'
                          }>
                            {image.status === 'submitting' ? 'Uploading...' :
                             image.status === 'submitted' ? 'Ready to Enhance' :
                             image.status}
                          </Badge>
                          {image.status === 'submitted' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          <Button variant="ghost" size="sm" onClick={() => handleRemove(image.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {(image.status === 'processing' || image.status === 'submitting') && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{image.status === 'submitting' ? 'Uploading...' : 'Enhancing...'}</span>
                            <span className="font-medium">{image.status === 'submitting' ? 'Uploading...' : `${Math.round(image.progress || 0)}%`}</span>
                          </div>
                          <Progress value={image.status === 'submitting' ? 50 : (image.progress || 0)} className="h-2" />
                        </div>
                      )}

                      <div className="flex gap-2">
                        {image.status === 'uploaded' && (
                          <Button onClick={() => handleSubmit(image.id)} size="sm" variant="outline">
                            <Upload className="h-4 w-4 mr-2" /> Submit to Server
                          </Button>
                        )}
                        {image.status === 'submitted' && (
                          <Button onClick={() => handleBeautify(image.id)} size="sm" className="bg-gradient-primary hover:shadow-primary">
                            <Sparkles className="h-4 w-4 mr-2" /> Beautify Image
                          </Button>
                        )}
                        {image.status === 'completed' && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handlePreview(image.enhanced)}>
                              <Eye className="h-4 w-4 mr-2" /> Preview Results
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadAll(image.enhanced)}>
                              <Download className="h-4 w-4 mr-2" /> Download All
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadZone;
