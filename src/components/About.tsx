import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <section
      id="about"
      className="px-4 py-24"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        color: "var(--color-text)",
      }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Image Side */}
        <div className="relative group">
          <Image
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop"
            alt="Modern luxury event design"
            className="w-full h-96 object-cover rounded-sm shadow-xl transition-transform duration-500 group-hover:scale-105"
            width={600}
            height={600}
          />
          <div className="absolute inset-0 bg-black/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content Side */}
        <div>
          <h2
            className="text-3xl md:text-5xl mb-8 tracking-wide"
            style={{ fontFamily: "Didot, serif" }}
          >
            Curating Moments,
            <br className="hidden md:block" /> Defining Elegance
          </h2>
          <p
            className="mb-6 leading-relaxed tracking-wide"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "300",
            }}
          >
            At Events By Kare, every gathering is more than an event—it is a
            story told through design, detail, and precision. Our philosophy
            blends architectural structure with editorial artistry, resulting in
            experiences that are both timeless and innovative.
          </p>
          <p
            className="leading-relaxed tracking-wide"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "300",
            }}
          >
            Every detail is considered. From haute couture-inspired styling to
            architectural precision in layout, we transform visions into
            unforgettable moments of sophistication and artistry.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
