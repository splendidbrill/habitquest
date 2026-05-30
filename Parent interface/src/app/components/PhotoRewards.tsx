import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Camera, Gift, Upload, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

export function PhotoRewards() {
  const navigate = useNavigate();
  const [uploadedPhotos, setUploadedPhotos] = useState(2);
  const [vouchersEarned, setVouchersEarned] = useState(1);
  const [ticketsThisWeek, setTicketsThisWeek] = useState(2);

  const handlePhotoUpload = () => {
    // Simulate photo upload
    setUploadedPhotos(uploadedPhotos + 1);
    setTicketsThisWeek(ticketsThisWeek + 1);
    
    // Random chance to earn voucher (like McDonald's Monopoly)
    const randomChance = Math.random();
    if (randomChance > 0.7) {
      setVouchersEarned(vouchersEarned + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/parent-dashboard")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="mb-1">Photo Rewards</h1>
            <p className="text-sm text-muted-foreground">
              Upload meals, earn vouchers
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="p-5 mb-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">
                {uploadedPhotos}
              </div>
              <p className="text-xs text-muted-foreground">Photos uploaded</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-1">
                {ticketsThisWeek}
              </div>
              <p className="text-xs text-muted-foreground">Tickets this week</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">
                {vouchersEarned}
              </div>
              <p className="text-xs text-muted-foreground">Vouchers won</p>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <Card className="p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3>How it works</h3>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <p>
                Take a photo of a home-cooked family meal or your child being
                active
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <p>Upload it here - every photo earns you one lottery-style ticket</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <p>
                Random chance to win vouchers for local shops, activities, or
                healthy food stores (like McDonald's Monopoly!)
              </p>
            </div>
          </div>
        </Card>

        {/* Upload Photo Button */}
        <Card className="p-6 mb-6 text-center border-dashed border-2 cursor-pointer hover:border-primary transition-all">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="photo-upload"
            onChange={handlePhotoUpload}
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="mb-2">Upload a photo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tap here to take or choose a photo
            </p>
            <Button size="lg" className="w-full">
              <Upload className="w-5 h-5 mr-2" />
              Choose photo
            </Button>
          </label>
        </Card>

        {/* Available Rewards */}
        <div className="mb-6">
          <h3 className="mb-4">Available rewards</h3>
          <div className="space-y-3">
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4>£5 Tesco voucher</h4>
                <p className="text-xs text-muted-foreground">1 in 10 chance</p>
              </div>
              <span className="text-sm font-medium text-primary">🎟️</span>
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Gift className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h4>Free swimming pass</h4>
                <p className="text-xs text-muted-foreground">1 in 20 chance</p>
              </div>
              <span className="text-sm font-medium text-secondary">🎟️🎟️</span>
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Gift className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h4>£10 Sports Direct voucher</h4>
                <p className="text-xs text-muted-foreground">1 in 30 chance</p>
              </div>
              <span className="text-sm font-medium text-accent-foreground">
                🎟️🎟️🎟️
              </span>
            </Card>
          </div>
        </div>

        {/* Info */}
        <Card className="p-4 bg-accent border-accent">
          <p className="text-sm text-accent-foreground">
            <span className="font-medium">💡 Remember:</span> This is about
            celebrating your efforts! Even if you don't win, you're building
            healthy habits with your family.
          </p>
        </Card>
      </div>
    </div>
  );
}
