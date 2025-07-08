
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface RadiusSelectorProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
}

export default function RadiusSelector({ radius, onRadiusChange }: RadiusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRadius, setTempRadius] = useState(radius);

  const handleApply = () => {
    onRadiusChange(tempRadius);
    setIsOpen(false);
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <MapPin className="w-4 h-4" />
        Search Radius: {formatDistance(radius)}
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-bookshelf-brown/20 rounded-lg shadow-lg p-4 w-80 z-10">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-bookshelf-dark block mb-2">
                Search within: {formatDistance(tempRadius)}
              </label>
              <Slider
                value={[tempRadius]}
                onValueChange={(value) => setTempRadius(value[0])}
                max={10000}
                min={500}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-bookshelf-dark/60 mt-1">
                <span>500m</span>
                <span>10km</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleApply}
                className="flex-1 bg-bookshelf-teal text-white hover:bg-bookshelf-teal/80"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
