import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Image, TrendingUp, Filter, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ProcessingHistory = () => {
  const stats = [
    { label: "Total Images", value: "156", icon: Image },
    { label: "Enhanced", value: "142", icon: TrendingUp },
    { label: "Avg Time", value: "2.3s", icon: Clock },
    { label: "Success Rate", value: "98.2%", icon: TrendingUp },
  ];

  const recentActivity = [
    {
      id: "ID-001",
      filename: "product_image_1.jpg",
      status: "completed",
      time: "2 min ago",
      enhancementType: "Background Remove"
    },
    {
      id: "ID-002", 
      filename: "lifestyle_shot.png",
      status: "completed",
      time: "5 min ago",
      enhancementType: "Color Enhancement"
    },
    {
      id: "ID-003",
      filename: "model_photo.jpg", 
      status: "processing",
      time: "1 min ago",
      enhancementType: "Upscale & Sharpen"
    },
    {
      id: "ID-004",
      filename: "product_banner.jpg",
      status: "completed",
      time: "8 min ago", 
      enhancementType: "Style Transfer"
    }
  ];

  return (
    <div className="w-80 border-l border-border bg-gradient-card p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">Processing Center</h2>
        <p className="text-sm text-muted-foreground">Track your enhancement progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Processing */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            Active Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Enhancement Progress</span>
              <span className="font-medium">87%</span>
            </div>
            <Progress value={87} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Estimated time: 0:23</span>
              <span>Queue: 2 items</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="mb-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by ID..." className="pl-10 h-8 text-sm" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Filter className="h-3 w-3 mr-1" />
            All
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">Done</Button>
          <Button variant="outline" size="sm" className="h-7 text-xs">Processing</Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <Card key={item.id} className="p-3 hover:shadow-md transition-all duration-normal">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={item.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.id}</span>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-sm font-medium text-foreground mb-1 truncate">
                {item.filename}
              </p>
              <p className="text-xs text-muted-foreground">{item.enhancementType}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Button className="w-full mt-6 bg-gradient-primary hover:shadow-primary" size="sm">
        View Full History
      </Button>
    </div>
  );
};

export default ProcessingHistory;