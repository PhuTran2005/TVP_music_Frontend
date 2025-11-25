import { motion } from "framer-motion";
import { Code, Palette, Zap, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const techStack = [
  {
    category: "Frontend",
    icon: Code,
    technologies: [
      {
        name: "React 18",
        description: "Modern functional components with hooks",
      },
      { name: "TypeScript", description: "Type-safe development" },
      {
        name: "Motion/React",
        description: "Smooth animations and transitions",
      },
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    category: "Styling",
    icon: Palette,
    technologies: [
      { name: "Tailwind CSS v4", description: "Utility-first CSS framework" },
      { name: "shadcn/ui", description: "Beautiful component library" },
      { name: "CSS Variables", description: "Dynamic theming system" },
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    category: "Performance",
    icon: Zap,
    technologies: [
      { name: "Vite", description: "Lightning-fast build tool" },
      { name: "Code Splitting", description: "Optimized bundle loading" },
      { name: "Modern ES6+", description: "Latest JavaScript features" },
    ],
    color: "from-orange-500 to-red-500",
  },
  {
    category: "UX/UI",
    icon: Smartphone,
    technologies: [
      { name: "Responsive Design", description: "Mobile-first approach" },
      { name: "Accessibility", description: "WCAG compliant components" },
      { name: "Progressive Enhancement", description: "Works everywhere" },
    ],
    color: "from-green-500 to-emerald-500",
  },
];

export function TechInfo() {
  return (
    <section className="py-16 lg:py-24 px-4 lg:px-6 bg-muted/30">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Built with Modern Technology
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powered by the latest web technologies for optimal performance and
            user experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((stack, index) => {
            const Icon = stack.icon;
            return (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${stack.color}`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">
                        {stack.category}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stack.technologies.map((tech, techIndex) => (
                      <motion.div
                        key={tech.name}
                        className="space-y-1"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + techIndex * 0.05 }}
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {tech.name}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tech.description}
                        </p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              Currently running React + Tailwind v4
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
