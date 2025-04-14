import React from "react";
import { BiLogoInstagram, BiLogoLinkedin } from "react-icons/bi";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';


const teamMembers = [
  {
    name: "Satyam Gupta",
    role: "Founder & CEO",
    quote: "Confidence is the product of preparation, and success is its reward.",
    linkedin: "https://www.linkedin.com/in/satyam-upadhyay-ba0582228/",
    instagram: "https://www.instagram.com/satya.am._/",
    image: "https://internview-assets.s3.ap-south-1.amazonaws.com/satyam+(2).jpg",
  },
  {
    name: "Upendra Yadav",
    role: "Chief Technology Officer",
    quote: "Through technology, we turn preparation into opportunity and dreams into reality.",
    linkedin: "https://www.linkedin.com/in/upendra-singh-68b94622a/",
    instagram: "https://www.instagram.com/mr_upen_/",
    image: "https://internview-assets.s3.ap-south-1.amazonaws.com/upendra+(1).jpg",
  },
];
const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Parallax Hero Section */}
      <motion.section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?auto=format&fit=crop&w=1920')] bg-cover bg-center"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                Redefining
              </span>
              <br />
              Career Success
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Where technical excellence meets human potential
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Core Values */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {['Innovation', 'Empowerment', 'Excellence'].map((value, index) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2 }}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="absolute inset-0 rounded-2xl border-2 border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-amber-600 text-4xl mb-4">0{index + 1}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{value}</h3>
              <p className="text-gray-600">
                {`Building ${value.toLowerCase()} through cutting-edge technology and human-centric design`}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Visionary Leadership
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The architects of next-generation career transformation
            </p>
          </motion.div>

          <div className="grid gap-16">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: index % 2 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${index % 2 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}
              >
                <div className="w-full md:w-1/3 relative group">
                  <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-bold text-gray-800">{member.name}</h3>
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-amber-600 font-medium">{member.role}</span>
                  </div>
                  <blockquote className="text-2xl text-gray-600 italic leading-relaxed">
                    "{member.quote}"
                  </blockquote>
                  <div className="flex gap-4">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      <BiLogoLinkedin className="w-6 h-6" />
                      <span className="font-medium">Connect</span>
                      <FiArrowUpRight className="w-4 h-4" />
                    </a>
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      <BiLogoInstagram className="w-6 h-6" />
                      <span className="font-medium">Follow</span>
                      <FiArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6">
          {['1000+', '98%', '4.9/5', '50+'].map((stat, index) => (
            <motion.div
              key={stat}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 border-b-4 border-amber-600"
            >
              <div className="text-4xl font-bold mb-4">{stat}</div>
              <div className="text-gray-400 uppercase text-sm tracking-wider">
                {['Candidates Trained', 'Success Rate', 'User Rating', 'Industry Partners'][index]}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-gray-800">
              Our Core Philosophy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We believe true career success lies at the intersection of technical mastery 
              and human connection. Our platform is designed to nurture both.
            </p>
            <button 
            onClick={() => navigate('/careers')}
            className="mt-12 inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Join the Revolution
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;