
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface PatientCardProps {
  id: string;
  name: string;
  image?: string;
  age: number;
  gender: string;
  pronouns?: string;
  provider?: string;
  className?: string;
}

export function PatientCard({
  id,
  name,
  image,
  age,
  gender,
  pronouns,
  provider,
  className,
}: PatientCardProps) {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className={cn("overflow-hidden card-hover", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium leading-none">{name}</h3>
              <Link
                to={`/patients/${id}`}
                className="text-medical-600 hover:text-medical-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              {age} years • {gender} {pronouns && `(${pronouns})`}
            </div>

            {provider && (
              <div className="text-xs text-muted-foreground">
                Provider: {provider}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
