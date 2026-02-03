import { Header } from '../components/layout/Header';
import { HomePage } from '../components/home/HomePage';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Pale Pink Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-rose-50/30 to-pink-100/50"></div>
        
        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-16 w-40 h-40 bg-pink-200/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-24 w-32 h-32 bg-rose-200/25 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-pink-100/30 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-32 right-1/4 w-28 h-28 bg-rose-300/20 rounded-full animate-bounce" style={{animationDelay: '0.8s', animationDuration: '5s'}}></div>
        
        {/* Large Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-pink-200/8 to-rose-200/12 rounded-full blur-3xl animate-spin" style={{animationDuration: '25s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-rose-100/12 to-pink-300/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-1/6 w-72 h-72 bg-gradient-to-br from-pink-150/10 to-rose-200/15 rounded-full blur-xl animate-bounce" style={{animationDelay: '3s', animationDuration: '6s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <HomePage />
      </div>
    </div>
  );
};

export default Index;
