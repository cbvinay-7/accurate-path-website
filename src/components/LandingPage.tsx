import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Brain, Users, BookOpen, Briefcase, CheckCircle, Star, Zap, Sparkles, Rocket, Code, Cpu, Lightbulb, Twitter, Facebook, Linkedin, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useRef, useState } from 'react';
import type { Points as PointsType } from 'three';
import { motion, Variants, Transition } from 'framer-motion';
import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Stars Background Component
function StarsBackground() {
  const ref = useRef<PointsType>(null);
  const count = 5000;
  const [sphere] = useState(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
      
      color.setHSL(
        Math.random(), // Full color spectrum
        0.9, // High saturation
        Math.random() * 0.5 + 0.5 // Brightness
      );
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    return { positions, colors };
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
      
      // Subtle parallax effect
      const { pointer } = state;
      ref.current.position.x = THREE.MathUtils.lerp(
        ref.current.position.x, 
        pointer.x * 0.5, 
        0.1
      );
      ref.current.position.y = THREE.MathUtils.lerp(
        ref.current.position.y, 
        pointer.y * 0.5, 
        0.1
      );
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points 
        ref={ref} 
        positions={sphere.positions} 
        colors={sphere.colors} 
        stride={3} 
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          vertexColors
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

const LandingPage = () => {
  const navigate = useNavigate();

  // Colorful floating icons
  const floatingIcons = [
    { Icon: Zap, delay: 0, color: "#FF5252", position: { left: "5%", top: "15%" } },
    { Icon: Target, delay: 0.3, color: "#FFEB3B", position: { left: "90%", top: "20%" } },
    { Icon: Code, delay: 0.6, color: "#4CAF50", position: { left: "10%", top: "75%" } },
    { Icon: Cpu, delay: 0.9, color: "#2196F3", position: { left: "85%", top: "70%" } },
    { Icon: Lightbulb, delay: 1.2, color: "#FF9800", position: { left: "50%", top: "10%" } },
    { Icon: Sparkles, delay: 1.5, color: "#E91E63", position: { left: "15%", top: "50%" } },
    { Icon: Rocket, delay: 1.8, color: "#9C27B0", position: { left: "80%", top: "45%" } }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  // Colorful features
  const features = [
    { 
      icon: Brain, 
      title: "AI-Powered Guidance", 
      description: "Intelligent recommendations tailored to your skills",
      color: "#E91E63" // Pink
    },
    { 
      icon: Target, 
      title: "Personalized Paths", 
      description: "Custom learning journeys for your career",
      color: "#FF9800" // Orange
    },
    { 
      icon: BookOpen, 
      title: "Resume Optimization", 
      description: "ATS-friendly resumes that impress",
      color: "#4CAF50" // Green
    },
    { 
      icon: Users, 
      title: "Interview Prep", 
      description: "AI simulations with feedback",
      color: "#2196F3" // Blue
    }
  ];

  // Initialize GSAP animations
  useLayoutEffect(() => {
    // Animate sections on scroll
    gsap.utils.toArray(".scroll-section").forEach((section: any) => {
      gsap.from(section, {
        opacity: 0,
        y: 100,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-black">
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <StarsBackground />
          </Suspense>
        </Canvas>
      </div>

      {/* Animated Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(255,0,100,0.2), transparent 60%)',
            'radial-gradient(circle at 80% 20%, rgba(0,200,255,0.2), transparent 60%)',
            'radial-gradient(circle at 40% 70%, rgba(150,0,255,0.2), transparent 60%)'
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, color, position }, index) => (
        <motion.div
          key={index}
          className={`absolute z-10`}
          style={{ ...position, color }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            y: [-40, 40, -40],
            x: [-20, 20, -20],
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
          }}
        >
          <Icon size={48} />
        </motion.div>
      ))}

      {/* Content Container */}
      <div className="relative z-20">
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  AccuratePath
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  onClick={() => navigate('/auth')}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                >
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-32 scroll-section">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-8">
              <motion.div 
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/40 text-yellow-200 px-6 py-3 rounded-full text-sm font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="h-5 w-5 text-yellow-300" />
                <span>AI-Powered Career Guidance</span>
              </motion.div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
            >
              <motion.span 
                className="block"
                animate={{
                  color: ['#FF5252', '#FF9800', '#4CAF50', '#2196F3'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                The Right Skills.
              </motion.span>
              <motion.span 
                className="block"
                animate={{
                  color: ['#FF9800', '#4CAF50', '#2196F3', '#FF5252'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2
                }}
              >
                The Right Time.
              </motion.span>
              <motion.span 
                className="block"
                animate={{
                  color: ['#4CAF50', '#2196F3', '#FF5252', '#FF9800'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 4
                }}
              >
                The Right Path.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              AI-powered personalized learning and career development platform that adapts to your unique journey.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 rounded-xl font-bold text-lg shadow-xl"
                >
                  <span className="relative z-10">Start Your Journey</span>
                  <ArrowRight className="ml-3 h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24 scroll-section bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Powerful <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Features</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Everything you need to navigate your career path with confidence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all`}
                  style={{ backgroundColor: `${feature.color}10` }}
                  whileHover={{ y: -10 }}
                >
                  <div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6`}
                    style={{ backgroundColor: feature.color }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-300 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 scroll-section bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AccuratePath</span>
                </h2>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  Designed to help students navigate their career journey with AI-powered personalized guidance.
                </p>
                <p className="text-xl text-gray-300 leading-relaxed">
                  We analyze your skills, goals, and market trends to create tailored learning paths.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl shadow-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-900/30 to-blue-900/30"
              >
                <div className="flex items-center mb-8">
                  <div className="p-3 rounded-xl bg-cyan-500/20 mr-4">
                    <Target className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                </div>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  To empower every student with intelligent, personalized career guidance through adaptive learning.
                </p>
                
                <div className="flex items-center mb-8">
                  <div className="p-3 rounded-xl bg-blue-500/20 mr-4">
                    <Briefcase className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Personalized learning recommendations",
                    "AI-powered career guidance",
                    "Smart resume optimization",
                    "Real interview simulations"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 scroll-section bg-gradient-to-br from-pink-900/30 to-purple-900/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Ready to Transform Your <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Career Path?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join thousands of students who've found their ideal career path with AccuratePath.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="relative overflow-hidden group bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-12 py-6 rounded-xl font-bold text-lg shadow-xl"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <ArrowRight className="ml-3 h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  AccuratePath
                </h1>
              </motion.div>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                AI-powered career guidance and personalized learning paths.
              </p>
              <div className="flex justify-center space-x-6 mb-8">
                {[Twitter, Facebook, Linkedin, Github].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="text-gray-400 hover:text-white p-2 rounded-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.a>
                ))}
              </div>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Accurate Info Solution. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;