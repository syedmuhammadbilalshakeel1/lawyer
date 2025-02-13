import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, BarChart, Shield } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">About LegalEase</h1>

      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-xl text-muted-foreground">
          LegalEase is revolutionizing the way law firms manage their practices.
          Our cutting-edge lawyer management system streamlines operations,
          enhances collaboration, and boosts productivity for legal
          professionals.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-center mb-6">Our Mission</h2>
      <Card className="mb-12">
        <CardContent className="p-6">
          <p className="text-center">
            To empower law firms with innovative technology solutions that
            simplify complex legal processes, allowing lawyers to focus on what
            they do best: serving their clients and upholding justice.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold text-center mb-6">Key Features</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {[
          {
            icon: CheckCircle,
            title: "Case Management",
            description:
              "Efficiently organize and track all your cases in one place.",
          },
          {
            icon: Users,
            title: "Client Portal",
            description:
              "Provide a secure platform for client communication and document sharing.",
          },
          {
            icon: BarChart,
            title: "Analytics Dashboard",
            description:
              "Gain insights into your firm's performance with comprehensive analytics.",
          },
          {
            icon: Shield,
            title: "Compliance Tools",
            description:
              "Stay up-to-date with regulatory requirements and manage risk effectively.",
          },
        ].map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <feature.icon className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-center mb-6">Our Team</h2>
      <Card className="mb-12">
        <CardContent className="p-6">
          <p className="text-center mb-4">
            LegalEase was founded by a team of legal professionals and tech
            experts who understood the unique challenges faced by modern law
            firms. Our diverse team brings together expertise in law, software
            development, user experience design, and customer support to deliver
            a comprehensive solution tailored for the legal industry.
          </p>
          <p className="text-center">
            We're committed to continuous innovation and providing unparalleled
            support to our clients, ensuring that LegalEase remains at the
            forefront of legal technology solutions.
          </p>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg">Schedule a Demo</Button>
      </div>
    </div>
  );
}
