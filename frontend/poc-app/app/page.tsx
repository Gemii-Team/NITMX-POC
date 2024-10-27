"use client";
import { useState } from 'react';
import Typewriter from 'typewriter-effect';
import Image from 'next/image';

export default function Home() {

  const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <h2
          onClick={() => setIsOpen(!isOpen)}
          className=" font-semibold text-content text-xl hover:text-accent primary-focus cursor-pointer"
        >
          {question}
        </h2>
        {isOpen && (
          <div className="mt-2 text-base-content ">
            {answer}
          </div>
        )}
        <hr className="my-4"/>
      </div>
    );
  };

  const faqs = [
    { question: 'How does your system detect fraud?', answer: 'Our system uses AI and Machine Learning to analyze real-time transaction behavior. It incorporates data from banks and government agencies to build transaction graphs that help detect and trace suspicious financial flows efficiently.' },
    { question: 'Who can use this platform?', answer: 'This platform is designed for commercial banks, other financial institutions, and government agencies involved in fraud investigation and prevention. They can join the Central Fraud Registry (CFR) system, provided they meet the required qualifications.' },
    { question: 'Does our bank or agency have to share data with others?', answer: 'Yes, this platform is designed to enable data sharing in a centralized system among banks and relevant agencies. This improves the efficiency of cross-bank and inter-agency fraud detection and prevention.' },
    { question: 'How secure is the customer data stored in the system?', answer: 'We prioritize top-level security for customer data. Our system complies with security standards such as ISO/IEC 27001, ISO/IEC 27701, and PCIDSS. Data encryption and strict access controls are in place to ensure maximum protection of sensitive information.' },
    { question: 'What benefits does our bank gain from using this platform?', answer: 'The platform helps banks reduce losses from fraud, detect high-risk transactions faster, and trace funds back to victims more effectively. It also boosts customer trust and lowers the cost of developing internal fraud solutions.' },
    { question: 'Does the system support Mobile Banking?', answer: 'Yes, the platform can integrate with Mobile Banking and other financial channels, allowing the detection and tracking of suspicious transactions across all channels used by a bank’s customers.' },
  ];

  return (
    <>
      <section id="home" className="hero min-h-screen" style={{ position: 'relative', overflow: 'hidden' }}>
        <video
          autoPlay
          loop
          muted
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        >
          <source src="/video/video2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="hero-content text-center  rounded-md backdrop-saturate-50 bg-base-200/30  size-4/12 w-[100%] " style={{ position: 'relative', zIndex: 1 }}>
          <div className="max-w-5xl">
            <h1 className="text-alight-left font-bold ">
              <span className=" text-5xl text-[#4361ee]">Welcome</span>
              <div id="app" className=" text-4xl mt-6 text-content">
                <Typewriter
                  options={{
                    loop: true,
                    delay: 100,
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .pauseFor(4500)
                      .typeString('Eye on your client,')
                      .pauseFor(1000)
                      .deleteChars(26)
                      .typeString('safety in your hands')
                      .pauseFor(1000)
                      .deleteChars(20)
                      .typeString('👁️')
                      .deleteChars(1)
                      .pauseFor(500)
                      .start();
                  }}
                />
              </div>
            </h1>
          </div>
        </div>
      </section>


      <section id="about" className="hero min-h-screen py-12 ">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold mb-4 p-4">About <span className="text-[#3a54d6]">Us</span></h2>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 p-4 ">
            <span className="text-left  m-2">
              <strong>Who We Are</strong>
              <p>We are a technology-driven company dedicated to developing advanced fraud detection and prevention platforms, designed to protect financial institutions and their customers from fraud, mule accounts, and related financial crimes. Our platform leverages AI, Machine Learning, and advanced data analytics to trace suspicious financial transactions and identify patterns that indicate fraud.</p>
              <br />
            </span>

            <span className="text-left  m-2">
              <strong>Our Vision</strong>
              <p>Our vision is to become the central hub of fraud prevention and detection information in Thailand. By integrating data from banks and government agencies, we aim to create a unified platform that enhances the accuracy and effectiveness of fraud detection, ultimately reducing financial damage and building trust in the nation’s financial system.</p>
              <br />
            </span>

            <span className="text-left  m-2">
              <strong>Our Vision</strong>
              <p>Our vision is to become the central hub of fraud prevention and detection information in Thailand. By integrating data from banks and government agencies, we aim to create a unified platform that enhances the accuracy and effectiveness of fraud detection, ultimately reducing financial damage and building trust in the nation’s financial system.</p>
              <br />
            </span>

            <span className="text-left m-2">
              <strong>Our Team</strong>
              <p>Our team consists of experts in AI technology and financial security with extensive experience in fraud detection. We are committed to continuously improving and modernizing our platform to stay ahead of evolving threats, ensuring the highest level of protection for our users.</p>
              <br />
            </span>

          </div>

        </div>

      </section>

      <section id="services" className="hero min-h-screen py-12 bg-base-200 p-2">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold mb-4 p-4">Our <span className="text-[#3a54d6]">Services</span></h2>

          <div className="flex justify-center items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2  p-5">
            <div className="text-xl sm:text-sm md:text-xl lg:text-xl">
              <span>1. Centralized Fraud Detection Platform</span><br />
              <span>2. Real-Time Transaction Monitoring</span><br />
              <span>3. Fraud Case Tracking and Investigation Tools</span><br />
              <span>4. Fraud Data Analytics and Reporting</span><br />
              <span>5. Customized Fraud Detection Solutions</span><br />
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/dia.png"
                width={500}
                height={100}
                alt=""
                priority
                className="rounded-md shadow-xl"
              />
            </div>
          </div>


        </div>
      </section>

      <section id="faq" className="hero min-h-screen py-12">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold mb-4 p-4 text-[#3a54d6]">FAQ</h2>
          <div className="bg-black-200 p-6 rounded-lg shadow-xl w-full ">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="hero min-h-screen py-12 p-2 bg-base-200">
        <div className="container mx-auto ">
          <h2 className="text-center p-5 text-5xl font-bold mb-4 ">Contact <span className="text-[#3a54d6]">Us</span></h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-screen-lg">

              <div className="max-w-xs rounded overflow-hidden shadow-xl  backdrop-blur-sm ">
                <div className="flex justify-center items-center min-h-scree p-2 m-2">
                  <img
                    className="w-full h-auto max-w-sm rounded-full object-cover"
                    src="/card/pwat.jpg"
                    alt="Profile Image1"
                  />
                </div>
                <div className="px-3 py-5">
                  <div className="font-bold text-xl text-center mb-1">EYE_wat</div>
                  <p className="text-primary text-base text-center">AI</p>
                  <hr className="p-1" />
                  <p className="text-content text-sm mt-1 text-balance text-left">
                    Email: wcrnsp@gmail.com<br /><br />
                  </p>
                </div>

                <div className="flex flex-nowrap justify-center  items-center mx-1 p-1 space-x-2 ">
                  <button className="p-2 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="https://www.linkedin.com/in/watchara-noisriphan?">linkedin</a></button>
                  <button className="p-1 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="https://github.com/wcr2000">Github</a></button>

                </div>
              </div>

              <div className="max-w-xs rounded overflow-hidden shadow-xl  backdrop-blur-sm ">
                <div className="flex justify-center items-center min-h-scree p-2 m-2">
                  <img
                    className="w-full h-auto max-w-sm rounded-full object-cover"
                    src="/card/part.jpg"
                    alt="Profile Image2"
                  />
                </div>
                <div className="px-3 py-5">
                  <div className="font-bold text-xl text-center mb-1">EYE_art</div>
                  <p className="text-primary text-base text-center">Full-Stack developer</p>
                  <hr className="p-1" />
                  <p className="text-content text-sm mt-1 text-balance text-left">
                    Email: wirachit.work@gmail.com<br />
                  </p>
                </div>

                <div className="flex flex-nowrap justify-center  items-center mx-1 p-1 space-x-2  ">
                  <button className="p-2 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="https://www.linkedin.com/in/wirachit-panasit-46048524a?">linkedin</a></button>
                  <button className="p-1 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="https://github.com/avadakedavra-wp">Github</a></button>

                </div>
              </div>

              <div className="max-w-xs rounded overflow-hidden shadow-xl  backdrop-blur-sm ">
                <div className="flex justify-center items-center min-h-scree p-2 m-2">
                  <img
                    className="w-full h-auto max-w-sm rounded-full object-cover"
                    src="/card/pnew.jpg"
                    alt="Profile Image3"
                  />
                </div>
                <div className="px-3 py-5">
                  <div className="font-bold text-xl text-center mb-1">EYE_new</div>
                  <p className="text-primary text-base text-center">Full-Stack developer</p>
                  <hr className="p-1" />
                  <p className="text-content text-sm mt-1 text-balance text-left">
                    Email: 65420147@kmitl.ac.th<br />
                  </p>
                </div>

                <div className="justify-center items-center mx-1 p-1 space-x-2 grid grid-cols-3 gap-3 ">
                  <button className="p-2 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="https://www.linkedin.com/in/nxwbtk?">linkedin</a></button>
                  <button className="p-1 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="https://www.instagram.com/stories/bsirikxm.dev">IG</a></button>
                  <button className="p-1 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="https://github.com/Nxwbtk">Github</a></button>

                </div>
              </div>

              <div className="max-w-xs rounded overflow-hidden shadow-xl  backdrop-blur-sm ">
                <div className="flex justify-center items-center min-h-scree p-2 m-2">
                  <Image
                    className="w-full h-auto max-w-sm rounded-full object-cover"
                    src="/card/pwave.jpg"
                    alt="Profile Image4"
                  />
                </div>
                <div className="px-3 py-5">
                  <div className="font-bold text-xl text-center mb-1">EYE_wave</div>
                  <p className="text-primary text-base text-center">UX/UI design</p>
                  <hr className="p-1" />
                  <p className="text-content text-sm mt-1 text-balance text-left">
                    Email: empty<br /><br />
                  </p>
                </div>

                <div className="flex flex-nowrap justify-center  items-center mx-1 p-1 space-x-2 ">
                  <button className="p-2 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="">Linkedin</a></button>
                  <button className="p-1 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="">Github</a></button>

                </div>
              </div>

              <div className="max-w-xs rounded overflow-hidden shadow-xl backdrop-blur-sm ">
                <div className="flex justify-center items-center min-h-scree p-2 m-2">
                  <img
                    className="w-full h-auto max-w-sm rounded-full object-cover"
                    src="/card/pmoss.jpg"
                    alt="Profile Image5"
                  />
                </div>
                <div className="px-3 py-5">
                  <div className="font-bold text-xl text-center mb-1">EYE_moss</div>
                  <p className="text-primary text-base text-center">Front-End developer</p>
                  <hr className="p-1" />
                  <p className="text-content text-sm mt-1 text-balance text-left">
                    Email: krittiphon.yoon@gmail.com<br />
                  </p>
                </div>

                <div className="justify-center items-center mx-1 p-1 space-x-2 grid grid-cols-3 gap-3">
                  <button className="p-2 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="https://1devp.netlify.app/">Website</a></button>
                  <button className="p-1 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="https://www.instagram.com/1dev_m">IG</a></button>
                  <button className="p-1 btn btn-base text-[#3280e0] hover:bg-base hover:text-[#3a54d6]"><a href="https://github.com/1Dev04">Github</a></button>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>


    </>
  );
}
