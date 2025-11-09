import { ArrowRight, Heart, Users, Package, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import heroBackground from '@/assets/hero-background.jpg';

const Home = () => {
  return (
    <div className="min-h-screen">
      <section id="home" className="relative pt-32 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10" 
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/50 to-background/40 -z-10" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="mb-6 animate-fade-in leading-tight">
            Share Food, Share <span className="text-primary">Kindness</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-10 px-4 text-gray-900 dark:text-white">
            Fighting hunger and reducing food waste in Ahmedabad with a simple, dignified solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button size="lg" asChild className="text-base md:text-lg">
              <Link to="/donate">
                Become a Food Partner <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base md:text-lg">
              <a href="#how-it-works">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="mb-8">About Community Fridge</h2>
          <p className="text-center text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-12 px-4">
            Community Fridge is a grassroots initiative in Ahmedabad dedicated to fighting hunger and reducing food waste. 
            We believe that no one should go hungry while perfectly good food goes to waste.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-6 md:p-8 text-center transition-all duration-300 border-2 hover:border-primary hover:-translate-y-1">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl mb-3">Our Mission</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                To provide dignified access to nutritious food for those in need while reducing food waste in our community.
              </p>
            </Card>
            <Card className="p-6 md:p-8 text-center transition-all duration-300 border-2 hover:border-secondary hover:-translate-y-1">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 md:h-8 md:w-8 text-secondary" />
              </div>
              <h3 className="text-xl md:text-2xl mb-3">Our Vision</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                A community where everyone has access to fresh, nutritious food, and food waste is minimized through sharing.
              </p>
            </Card>
            <Card className="p-6 md:p-8 text-center transition-all duration-300 border-2 hover:border-accent hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-7 w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl mb-3">Our Values</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Dignity, sustainability, community, and compassion guide everything we do at Community Fridge.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="mb-4">How It Works</h2>
          <p className="text-center text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 px-4">
            Our simple four-step process makes it easy to donate food and help those in need
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12">
            {[
              { step: '1', title: 'Food Partners Donate', desc: 'Restaurants, cafes, and individuals donate surplus food'},
              { step: '2', title: 'We Collect', desc: 'Our team safely collects and stores the donated food'},
              { step: '3', title: 'Community Access', desc: 'Anyone in need can access fresh food with dignity'},
              { step: '4', title: 'Zero Waste', desc: 'Reducing food waste while feeding our community'}
            ].map((item, i) => (
              <Card key={i} className="text-center group p-6 transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
                <div className="relative mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center mx-auto text-2xl md:text-3xl font-bold text-white group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl mb-2 font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section id="impact" className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="mb-8">Our Impact</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
            <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 to-accent/10 transition-all hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <p className="text-lg md:text-xl text-muted-foreground">Meals Distributed</p>
            </Card>
            <Card className="p-6 md:p-8 bg-gradient-to-br from-secondary/10 to-primary/10 transition-all hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">50+</div>
              <p className="text-lg md:text-xl text-muted-foreground">Food Partners</p>
            </Card>
            <Card className="p-6 md:p-8 bg-gradient-to-br from-accent/20 to-secondary/10 transition-all hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">200kg</div>
              <p className="text-lg md:text-xl text-muted-foreground">Food Waste Reduced</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="get-involved" className="py-16 md:py-20 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto max-w-7xl text-center relative z-10">
          <h2 className="mb-4">Get Involved</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 px-4">
            Join us in making a difference. Whether you're a restaurant, volunteer, or supporter, 
            there's a place for you in our community.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8 px-4">
            <Card className="p-8 transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">Become a Food Partner</h3>
              <p className="text-muted-foreground mb-6">Share your surplus food and make a direct impact on reducing waste while feeding the community</p>
              <Button size="lg" asChild className="w-full">
                <Link to="/donate">Join as Partner</Link>
              </Button>
            </Card>
            <Card className="p-8 transition-all duration-300 hover:-translate-y-2 border-2 hover:border-secondary group">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-secondary transition-colors">Support Our Mission</h3>
              <p className="text-muted-foreground mb-6">Reach out to learn more about how you can support our mission through donations or partnerships</p>
              <Button size="lg" variant="outline" asChild className="w-full">
                <a href="#contact">Contact Us</a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-8">Contact Us</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-12 px-4">
            Have questions or want to get involved? We'd love to hear from you!
          </p>
          <div className="space-y-4 md:space-y-6">
            <Card className="p-4 md:p-6 flex items-center gap-3 md:gap-4 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm md:text-base">Location</p>
                <p className="text-sm md:text-base text-muted-foreground">Ahmedabad, Gujarat, India</p>
              </div>
            </Card>
            <Card className="p-4 md:p-6 flex items-center gap-3 md:gap-4 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm md:text-base">Phone</p>
                <a href="tel:+917778005753" className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors">
                  +91-7778005753
                </a>
              </div>
            </Card>
            <Card className="p-4 md:p-6 flex items-center gap-3 md:gap-4 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm md:text-base">Email</p>
                <a href="mailto:communityfridge21@gmail.com" className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors break-all">
                  communityfridge21@gmail.com
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t py-6 md:py-8 px-4">
        <div className="container mx-auto text-center text-sm md:text-base text-muted-foreground">
          <p>&copy; 2025 Community Fridge by Neev Lila, Maunil Shah, Saumya Prajapati, Niyati Shah, Yash Patel, Hari Patel, Shlok Patel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
