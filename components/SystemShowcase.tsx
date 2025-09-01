"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const SystemShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      src: "/CapaDashboard.png",
      alt: "Dashboard Principal",
      title: "Dashboard Intuitivo",
      description: "Visão geral completa do seu sistema de pontos",
    },
    {
      src: "/Capaclientes.png",
      alt: "Gestão de Clientes",
      title: "Gestão de Clientes",
      description: "Cadastre e gerencie todos os seus clientes",
    },
    {
      src: "/CapaTransacao.png",
      alt: "Transações de Pontos",
      title: "Transações de Pontos",
      description: "Acompanhe todas as movimentações de pontos",
    },
    {
      src: "/Capapremios.png",
      alt: "Gestão de Premiações",
      title: "Gestão de Premiações",
      description: "Cadastre e gerencie todos os seus prêmios",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Veja Como Nossa
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {" "}
              Plataforma Funciona
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interface intuitiva e funcionalidades poderosas que fazem a
            diferença no seu negócio
          </p>
        </div>

        <div className="relative w-full h-[600px] overflow-hidden rounded-2xl shadow-2xl">
          {/* Main Image */}
          <div className="relative w-full h-full">
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="object-cover transition-all duration-500 ease-in-out"
            />

            {/* Overlay with title and description */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {images[currentIndex].title}
              </h3>
              <p className="text-white/90">
                {images[currentIndex].description}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 rounded-full p-3 text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 rounded-full p-3 text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="mt-8 flex justify-center space-x-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                index === currentIndex
                  ? "ring-2 ring-primary scale-110"
                  : "hover:scale-105"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemShowcase;
