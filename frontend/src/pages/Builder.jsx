import { Link } from 'react-router-dom';
import {
  FileText,
  Layout,
  Palette,
  Download,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const Builder = () => {
  const features = [
    {
      icon: Layout,
      title: 'Professional Templates',
      description:
        'Choose from dozens of ATS-optimized templates designed by career experts.',
    },
    {
      icon: Palette,
      title: 'Easy Customization',
      description:
        'Customize colors, fonts, and layouts to match your personal brand.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Content',
      description:
        'Get AI suggestions for better bullet points and achievement statements.',
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description:
        'Export your resume as PDF, Word, or plain text for any application.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-6">
            <Sparkles size={16} />
            Coming Soon
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Resume Builder
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto">
            Create a stunning, ATS-optimized resume in minutes with our intuitive
            builder
          </p>
        </div>

        {/* Preview Section */}
        <div className="max-w-4xl mx-auto mb-16 bg-white rounded-2xl shadow p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Resume Preview */}
            <div className="flex-1">
              <div className="aspect-[8.5/11] bg-white border rounded-xl shadow p-6">
                <div className="space-y-4">
                  <div className="h-8 w-48 bg-blue-200 rounded" />
                  <div className="h-3 w-32 bg-gray-300 rounded" />
                  <div className="h-px bg-gray-200 my-4" />

                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-300 rounded" />
                    <div className="h-3 w-5/6 bg-gray-300 rounded" />
                    <div className="h-3 w-4/5 bg-gray-300 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex-1 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 mx-auto md:mx-0">
                <FileText size={32} className="text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold mb-4">
                Build Your Perfect Resume
              </h2>

              <p className="text-gray-600 mb-6">
                Our resume builder will help you create a professional,
                ATS-friendly resume that stands out to recruiters.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button
                  disabled
                  className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gray-300 text-gray-600 cursor-not-allowed"
                >
                  Start Building
                  <ArrowRight size={16} />
                </button>

                <Link to="/upload">
                  <button className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">
                    Analyze Existing Resume
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-center mb-8">
            What to expect
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl bg-white shadow hover:shadow-md transition"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-blue-600" />
                  </div>

                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notify Section */}
        <div className="max-w-xl mx-auto mt-16 text-center">
          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-2">
              Want to be notified when it launches?
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Leave your email and we'll let you know when it's ready.
            </p>

            <div className="flex gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
