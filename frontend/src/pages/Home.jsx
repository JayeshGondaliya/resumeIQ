import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  TrendingUp,
  FileSearch,
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: FileSearch,
      title: 'ATS Score Analysis',
      description:
        'Get an instant compatibility score showing how well your resume performs with ATS systems.',
    },
    {
      icon: Target,
      title: 'Role Matching',
      description:
        'Discover job roles that best match your skills using AI-powered insights.',
    },
    {
      icon: Zap,
      title: 'Improvement Tips',
      description:
        'Receive actionable suggestions to enhance your resume and boost hiring chances.',
    },
    {
      icon: TrendingUp,
      title: 'Interview Roadmap',
      description:
        'Get a personalized preparation roadmap to ace technical interviews.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Resumes Analyzed' },
    { value: '85%', label: 'Success Rate' },
    { value: '4.9★', label: 'User Rating' },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
            <Zap size={16} />
            AI-Powered Resume Analysis
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Analyze. Improve.{' '}
            <span className="text-blue-600">Get Hired.</span>
          </h1>

          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            ResumeIQ analyzes your resume, gives ATS insights, and helps you
            prepare for your dream job interviews.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/upload">
              <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Analyze My Resume
                <ArrowRight size={20} />
              </button>
            </Link>

            <Link to="/builder">
              <button className="px-8 py-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Build Resume
              </button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            {['Free to use', 'No signup required', 'Instant results'].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Optimize your resume and prepare smarter with ResumeIQ tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                    <Icon size={28} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to transform your job search?
        </h2>

        <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
          Upload your resume now and get instant insights to boost interview
          calls.
        </p>

        <Link to="/upload">
          <button className="flex items-center gap-2 mx-auto px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition">
            Get Started Free
            <ArrowRight size={20} />
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
