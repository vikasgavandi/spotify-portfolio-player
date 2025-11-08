import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, MoreHorizontal, Volume2, ListMusic } from 'lucide-react';

const SpotifyPortfolioPlayer = () => {
  // Inject Spotify Mix font
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
      
      * {
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif !important;
      }
      
      .spotify-heading {
        font-weight: 900;
        letter-spacing: -0.04em;
      }
      
      .spotify-body {
        font-weight: 400;
        letter-spacing: -0.01em;
      }
      
      .spotify-bold {
        font-weight: 700;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState([]);
  const speechSynthesis = useRef(window.speechSynthesis);
  const currentUtterance = useRef(null);
  const progressInterval = useRef(null);

  const playlist = [
    {
      id: 1,
      title: "Professional Summary",
      artist: "Vikas Gavandi",
      album: "Career Journey",
      duration: "0:45",
      durationSeconds: 45,
      image: "bg-gradient-to-br from-blue-500 to-purple-600",
      content: "Hi, I'm Vikas Shakuntala B. Gavandi, a Software Engineer and Visualizer with over 6 years of experience in UX UI and software development, and 13 plus years across diverse domains. I specialize in building clean, scalable web applications, covering UI UX design, advertising, and full-stack development. As a collaborative problem-solver and aspiring software architect, I focus on creating innovative solutions and exceptional software."
    },
    {
      id: 2,
      title: "Current Role - KnoxxFoods",
      artist: "Remote | Australia",
      album: "March 2025 - Present",
      duration: "1:15",
      durationSeconds: 75,
      image: "bg-gradient-to-br from-green-500 to-teal-600",
      content: "Currently, I'm working remotely as a Creative Visualizer and Software Developer at KnoxxFoods Pty Ltd in Australia. I've created a smart chatbot using Node.js, MySQL, JavaScript, and OpenAI with a clean interface for real-time human-like conversations. I'm also developing a comprehensive Customer Order Portal with features like customer-specific pricing, inventory tracking, order approval, and warehouse operations. Additionally, I've created interactive activities including a photo framer, quiz game app, and offline forms."
    },
    {
      id: 3,
      title: "Alembic Pharmaceuticals",
      artist: "Senior Software Developer",
      album: "May 2021 - Feb 2025",
      duration: "1:00",
      durationSeconds: 60,
      image: "bg-gradient-to-br from-red-500 to-orange-600",
      content: "At Alembic Pharmaceuticals, I served as a Senior Software Developer working with Figma, Miro, Node.js, Golang, AWS, Angular, and PHP. I developed an LMS Platform, excel AI, and a File Sharing Wizard with strict external access restrictions. I also built a MEAN Stack Ticketing system to streamline operations."
    },
    {
      id: 4,
      title: "FancyFluff Experience",
      artist: "Motion & Web Designer",
      album: "Aug 2020 - Oct 2021",
      duration: "0:50",
      durationSeconds: 50,
      image: "bg-gradient-to-br from-pink-500 to-purple-600",
      content: "As a Motion and Senior Web Designer at FancyFluff, I developed DesignFlow, a chatbot offering 24/7 customer support to boost client satisfaction. I also created interactive Instagram games with engaging motion graphics to drive engagement on social media platforms."
    },
    {
      id: 5,
      title: "Technical Skills",
      artist: "Full Stack Developer",
      album: "Programming & Design",
      duration: "0:55",
      durationSeconds: 55,
      image: "bg-gradient-to-br from-indigo-500 to-blue-600",
      content: "My technical expertise includes programming in NodeJS, Golang, C++, TypeScript, and php. I work with frameworks like Angular, Express JS, and Bootstrap. For databases, I use MySQL, MongoDB, and PostgreSQL. I'm proficient in design tools like Figma, Miro, AutoCAD, and the complete Adobe Creative Suite. I also have experience with AWS, CI-CD pipelines, and RESTful APIs."
    },
    {
      id: 6,
      title: "Educational Background",
      artist: "Vikas Gavandi",
      album: "Academic Journey",
      duration: "0:40",
      durationSeconds: 40,
      image: "bg-gradient-to-br from-yellow-500 to-orange-600",
      content: "I hold a B.Sc in IT from Symbiosis International University, completed between 2008 and 2011 with an A grade. I also earned a Diploma in Software Programming and Typography from Mumbai Software Institute, both with A grades. I'm continuously learning, currently exploring Software Architecture, Data Structures and Algorithms, and UX Product Design principles."
    },
    {
      id: 7,
      title: "Personal Philosophy",
      artist: "Vikas Gavandi",
      album: "Career Vision",
      duration: "0:35",
      durationSeconds: 35,
      image: "bg-gradient-to-br from-emerald-500 to-green-600",
      content: "I believe in collaborative problem-solving and creating innovative solutions. My goal is to become a software architect who builds exceptional, scalable software that makes a real difference. I'm passionate about clean code, user-centric design, and continuous learning."
    }
  ];

  const speakText = (text) => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Optimal settings for natural human-like speech
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0; // Natural pitch
      utterance.volume = 1;
      utterance.lang = 'en-US'; // Ensure English pronunciation
      
      const voices = speechSynthesis.current.getVoices();
      
      // Priority order for best quality female voices
      const preferredVoices = [
        'Google US English Female',
        'Google UK English Female', 
        'Microsoft Zira - English (United States)',
        'Samantha',
        'Victoria',
        'Karen',
        'Fiona',
        'Moira',
        'Tessa',
        'Microsoft Aria Online (Natural) - English (United States)',
        'Microsoft Jenny Online (Natural) - English (United States)'
      ];
      
      // Try to find the best available voice
      let selectedVoice = null;
      for (const preferred of preferredVoices) {
        selectedVoice = voices.find(voice => voice.name.includes(preferred));
        if (selectedVoice) break;
      }
      
      // Fallback to any female voice if preferred ones aren't available
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          (voice.name.includes('Microsoft') && voice.name.includes('Zira'))
        );
      }
      
      // Use English language voice if no female voice found
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && !voice.name.toLowerCase().includes('male')
        );
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name);
      }
      
      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(0);
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      };
      
      currentUtterance.current = utterance;
      speechSynthesis.current.speak(utterance);
    }
  };

  const startProgress = () => {
    setProgress(0);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    const duration = playlist[currentTrack].durationSeconds;
    const increment = 100 / duration;
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          return 100;
        }
        return prev + increment;
      });
    }, 1000);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      speechSynthesis.current.pause();
      setIsPlaying(false);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    } else {
      if (speechSynthesis.current.paused) {
        speechSynthesis.current.resume();
      } else {
        speakText(playlist[currentTrack].content);
        startProgress();
      }
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    speechSynthesis.current.cancel();
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    const next = (currentTrack + 1) % playlist.length;
    setCurrentTrack(next);
    setProgress(0);
    if (isPlaying) {
      setTimeout(() => {
        speakText(playlist[next].content);
        startProgress();
      }, 100);
    }
  };

  const prevTrack = () => {
    speechSynthesis.current.cancel();
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    const prev = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(prev);
    setProgress(0);
    if (isPlaying) {
      setTimeout(() => {
        speakText(playlist[prev].content);
        startProgress();
      }, 100);
    }
  };

  const selectTrack = (index) => {
    speechSynthesis.current.cancel();
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    setCurrentTrack(index);
    setProgress(0);
    setIsPlaying(true);
    setTimeout(() => {
      speakText(playlist[index].content);
      startProgress();
    }, 100);
  };

  const toggleLike = (id) => {
    setLiked(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    // Load voices when they become available
    const loadVoices = () => {
      const voices = speechSynthesis.current.getVoices();
      if (voices.length > 0) {
        console.log('Available voices:', voices.map(v => v.name));
      }
    };
    
    loadVoices();
    
    // Chrome loads voices asynchronously
    if (speechSynthesis.current.onvoiceschanged !== undefined) {
      speechSynthesis.current.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-b from-green-900 via-gray-900 to-black overflow-y-auto">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-green-500 rounded-full p-3">
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold spotify-heading">Spotify</h1>
          </div>

          {/* Album Art & Info */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-8">
            <div className={`w-64 h-64 rounded-lg shadow-2xl flex items-center justify-center ${playlist[currentTrack].image}`}>
              <div className="text-center p-6">
                <div className="text-6xl mb-4">🎵</div>
                <p className="text-sm font-semibold">Track {currentTrack + 1}</p>
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-semibold mb-2 spotify-bold tracking-wider">PLAYLIST</p>
              <h2 className="text-5xl md:text-7xl font-black mb-4 spotify-heading leading-tight">{playlist[currentTrack].title}</h2>
              <div className="flex items-center gap-2 text-sm spotify-body">
                <span className="font-semibold spotify-bold">{playlist[currentTrack].artist}</span>
                <span>•</span>
                <span>{playlist.length} tracks</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 mb-6">
            <button 
              onClick={togglePlayPause}
              className="bg-green-500 hover:bg-green-400 rounded-full p-4 hover:scale-105 transition-all shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-black" fill="currentColor" />
              ) : (
                <Play className="w-7 h-7 text-black ml-1" fill="currentColor" />
              )}
            </button>
            
            <button 
              onClick={() => toggleLike(playlist[currentTrack].id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Heart 
                className="w-8 h-8" 
                fill={liked.includes(playlist[currentTrack].id) ? '#1DB954' : 'none'} 
                stroke={liked.includes(playlist[currentTrack].id) ? '#1DB954' : 'currentColor'}
              />
            </button>
            
            <button className="text-gray-400 hover:text-white transition-colors">
              <MoreHorizontal className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Track List */}
        <div className="px-6 pb-32">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800 mb-2 spotify-bold tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-6">TITLE</div>
              <div className="col-span-4">ALBUM</div>
              <div className="col-span-1 text-right">⏱</div>
            </div>
            
            {playlist.map((track, index) => (
              <div
                key={track.id}
                onClick={() => selectTrack(index)}
                className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-md cursor-pointer transition-all group ${
                  currentTrack === index
                    ? 'bg-gray-800/50'
                    : 'hover:bg-gray-800/30'
                }`}
              >
                <div className="col-span-1 flex items-center">
                  {currentTrack === index && isPlaying ? (
                    <div className="flex gap-0.5">
                      <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                      <div className="w-1 h-4 bg-green-500 animate-pulse delay-75"></div>
                      <div className="w-1 h-4 bg-green-500 animate-pulse delay-150"></div>
                    </div>
                  ) : (
                    <span className={currentTrack === index ? 'text-green-500' : 'text-gray-400'}>
                      {index + 1}
                    </span>
                  )}
                </div>
                
                <div className="col-span-6 flex items-center gap-3">
                  <div className={`w-12 h-12 rounded ${track.image} flex items-center justify-center text-xl`}>
                    🎵
                  </div>
                  <div>
                    <p className={`font-semibold spotify-bold ${currentTrack === index ? 'text-green-500' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-sm text-gray-400 spotify-body">{track.artist}</p>
                  </div>
                </div>
                
                <div className="col-span-4 flex items-center text-gray-400 text-sm spotify-body">
                  {track.album}
                </div>
                
                <div className="col-span-1 flex items-center justify-end gap-3">
                  <Heart 
                    className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-green-500"
                    fill={liked.includes(track.id) ? '#1DB954' : 'none'}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track.id);
                    }}
                  />
                  <span className="text-gray-400 text-sm spotify-body">{track.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3">
        <div className="max-w-screen-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="w-full bg-gray-700 rounded-full h-1 group cursor-pointer">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all relative group-hover:bg-green-400"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Current Track Info */}
            <div className="flex items-center gap-3 w-80">
              <div className={`w-14 h-14 rounded ${playlist[currentTrack].image} flex items-center justify-center`}>
                🎵
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate spotify-bold">{playlist[currentTrack].title}</p>
                <p className="text-xs text-gray-400 truncate spotify-body">{playlist[currentTrack].artist}</p>
              </div>
              <Heart 
                className="w-5 h-5 ml-2 cursor-pointer hover:text-green-500 transition-colors"
                fill={liked.includes(playlist[currentTrack].id) ? '#1DB954' : 'none'}
                stroke={liked.includes(playlist[currentTrack].id) ? '#1DB954' : 'currentColor'}
                onClick={() => toggleLike(playlist[currentTrack].id)}
              />
            </div>

            {/* Center Controls */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Shuffle className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={prevTrack}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipBack className="w-5 h-5" fill="currentColor" />
                </button>
                
                <button 
                  onClick={togglePlayPause}
                  className="bg-white hover:scale-105 rounded-full p-2 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-black" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                  )}
                </button>
                
                <button 
                  onClick={nextTrack}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipForward className="w-5 h-5" fill="currentColor" />
                </button>
                
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Repeat className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 w-80 justify-end">
              <ListMusic className="w-5 h-5 text-gray-400" />
              <Volume2 className="w-5 h-5 text-gray-400" />
              <div className="w-24 bg-gray-700 rounded-full h-1 cursor-pointer group">
                <div className="bg-white w-3/4 h-1 rounded-full group-hover:bg-green-500 relative">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPortfolioPlayer;
export { SpotifyPortfolioPlayer as App };