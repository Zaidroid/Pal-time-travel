// src/App.jsx (with simplified prompt for testing)
import React, { useState, useEffect, useRef } from 'react';
import './index.css';

function App() {
    const [year, setYear] = useState('');
    const [location, setLocation] = useState('');
    const [narrative, setNarrative] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en');
    const [isPlaying, setIsPlaying] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [occupation, setOccupation] = useState('');
    const [gender, setGender] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioUrl, setAudioUrl] = useState('');
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const audioRef = useRef(null);


    const locations = [
        "Jerusalem", "Hebron", "Nablus", "Ramallah", "Gaza", "Tulkarem",
        "Jenin", "Qalqilya", "Jericho", "Bethlehem", "Khan Yunis",
        "Deir al-Balah", "Rafah", "Beit Lahia", "Beit Hanoun", "Jabalia",
        "Bani Suheila", "Abasan al-Kabira", "Yatta"
    ];
    const arabicLocations = [
        "القدس", "الخليل", "نابلس", "رام الله", "غزة", "طولكرم",
        "جنين", "قلقيلية", "أريحا", "بيت لحم", "خان يونس", "دير البلح",
        "رفح", "بيت لاهيا", "بيت حانون", "جباليا", "بني سهيلا", "عبسان الكبيرة", "يطا"
    ];

    const genders = ["Male", "Female"];
    const arabicGenders = ["ذكر", "أنثى"];

    const translations = {
        en: {
            title: "Palestine Time Travel Simulator",
            subtitle: "Step into Palestine’s Past",
            yearLabel: "Year:",
            locationLabel: "Location:",
            nameLabel: "Person's Name:",
            ageLabel: "Age:",
            occupationLabel: "Occupation (Optional):",
            genderLabel: "Gender:",
            yearPlaceholder: `Enter a year (1800-${new Date().getFullYear()})`,
            locationPlaceholder: "Select a location",
            namePlaceholder: "Enter a name",
            agePlaceholder: "Enter age",
            occupationPlaceholder: "Enter occupation",
            genderPlaceholder: "Select gender",
            travelButton: "Travel Now",
            travelingButton: "Traveling...",
            randomButton: "Random Journey",
            loadingText: "Loading...",
            narrativeTitle: "Narrative",
            imageTitle: "Image",
            audioTitle: "Audio",
            playAudio: "Play",
            pauseAudio: "Pause",
            stopAudio: "Stop",
        },
        ar: {
            title: "محاكي السفر عبر الزمن في فلسطين",
            subtitle: "ادخل إلى ماضي فلسطين",
            yearLabel: "السنة:",
            locationLabel: "الموقع:",
            nameLabel: "اسم الشخص:",
            ageLabel: "العمر:",
            occupationLabel: "المهنة (اختياري):",
            genderLabel: "الجنس:",
            yearPlaceholder: `أدخل سنة (1800-${new Date().getFullYear()})`,
            locationPlaceholder: "اختر موقعًا",
            namePlaceholder: "أدخل اسمًا",
            agePlaceholder: "أدخل العمر",
            occupationPlaceholder: "أدخل المهنة",
            genderPlaceholder: "اختر الجنس",
            travelButton: "سافر الآن",
            travelingButton: "جارٍ السفر...",
            randomButton: "رحلة عشوائية",
            loadingText: "جارٍ التحميل...",
            narrativeTitle: "السرد",
            imageTitle: "الصورة",
            audioTitle: "الصوت",
            playAudio: "تشغيل",
            pauseAudio: "إيقاف",
            stopAudio: "إيقاف",
        }
    };

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const toggleLanguage = () => {
        setLanguage(prevLanguage => prevLanguage === 'en' ? 'ar' : 'en');
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Cleanup function to cancel any ongoing audio
        return () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = ""; // Unload the audio
          }
        };
    }, [theme]);


    const generateNarrative = async (year, location, personName, personAge, personOccupation, personGender) => {
        try {
            const hasOccupation = personOccupation && personOccupation.trim() !== '';
            const prompt = language === 'en'
                ? `Describe a day in the life of a Palestinian ${personGender} named ${personName}, ${personAge} years old${hasOccupation ? `, who works as ${personOccupation},` : ''} in ${location}, Palestine in the year ${year}. Provide a unique and memorable, first-person account of their daily life, culture, and experiences, focusing on the historical context of that year. Avoid focusing on religious aspects unless directly relevant to their daily routine. Keep the narrative between 300-500 words.`
                : `صف يومًا في حياة ${personGender === 'Male' ? 'رجل' : 'امرأة'} فلسطيني${personGender === 'Male' ? '' : 'ة'} اسم${personGender === 'Male' ? 'ه' : 'ها'} ${personName}، عمر${personGender === 'Male' ? 'ه' : 'ها'} ${personAge} عامًا${hasOccupation ? `، ويعمل ${personOccupation}،` : ''} في ${location}، فلسطين في عام ${year}. قدم وصفًا فريدًا لا يُنسى، بصيغة المتكلم، عن حياته اليومية وثقافته وتجاربه، مع التركيز على السياق التاريخي لتلك السنة. تجنب التركيز على الجوانب الدينية إلا إذا كانت ذات صلة مباشرة بالروتين اليومي للشخص. اجعل السرد يتراوح بين 300 و 500 كلمة.`;

            const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
            console.log("API URL:", apiUrl);
            console.log("API Key:", import.meta.env.VITE_OPENROUTER_API_KEY);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "google/gemini-2.0-pro-exp-02-05:free",
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                })
            });

            // Log the raw response text:
            const rawResponse = await response.text();
            console.log("Raw API Response:", rawResponse);

            if (!response.ok) {
                // Try to parse as JSON, but fall back to the raw text if it fails
                const errorData = await response.json().catch(() => ({ message: rawResponse }));
                const errorMessage = errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMessage);
            }


            const data = JSON.parse(rawResponse); // Parse the raw response
            console.log("API Response Data:", data);


            if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
                throw new Error("Invalid API response format: 'choices' array is missing or empty.");
            }

            if (!data.choices[0].message || typeof data.choices[0].message.content !== 'string') {
                throw new Error("Invalid API response format: 'message.content' is missing or not a string.");
            }


            return data.choices[0].message.content;

        } catch (error) {
            console.error("Error fetching narrative:", error);
            throw error;
        }
    };

    const generateImage = (year, location) => {
        // Placeholder
        return "";
    };

    const generateAudioElevenLabs = async (text) => {
        const voiceId = language === "en" ? "pNInz6obpgDQGcFmaJgB" : "ErXwobaYiN019PkySvjV"; // Adam for English, Arab for Arabic
        const apiURL = `/api/elevenlabs/text-to-speech/${voiceId}`; // Use the proxy
        console.log("ElevenLabs API URL:", apiURL);
        console.log("ElevenLabs API Key:", import.meta.env.VITE_ELEVENLABS_API_KEY); //verify the key

        try {
            const headers = {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
            };
            console.log("Request Headers:", headers); // Log the headers

            const response = await fetch(apiURL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    "model_id": "eleven_multilingual_v2",
                    "text": language === "en" ? "test" : "اختبار", // Simplified prompt
                    "voice_settings": {
                        "similarity_boost": 0.75,
                        "stability": 0.5,
                        "style": 0.25,
                        "use_speaker_boost": true
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get the raw text first
                console.error("ElevenLabs API Error Response:", errorText);
                const errorData = await response.json().catch(() => ({ message: errorText })); // Try to parse, fallback to raw
                const errorMessage = errorData.detail?.message || errorData.message || `ElevenLabs API error! status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            return audioUrl;

        } catch (error) {
            console.error("Error in generateAudioElevenLabs:", error);
            throw error; // Re-throw to be caught in handleTravel
        }
    };



    const handleTravel = async () => {
        setLoading(true);
        setNarrative('');
        setImage('');
        setError(null);
        setIsPlaying(false);
        setName('');
        setAge('');
        setOccupation('');
        setGender('');
        setCurrentTime(0);
        setDuration(0);
        setAudioUrl(''); // Clear previous audio URL

        if (audioRef.current) {
            audioRef.current.pause(); // Pause any existing audio
            audioRef.current.currentTime = 0; // Reset time
        }


        try {
            const generatedNarrative = await generateNarrative(year, language === 'ar' ? arabicLocations[locations.indexOf(location)] : location, name, age, occupation, gender);
            setNarrative(generatedNarrative);
            const generatedImage = generateImage(year, location);
            setImage(generatedImage);

            // Generate audio using ElevenLabs
            const audioUrl = await generateAudioElevenLabs(generatedNarrative);
            setAudioUrl(audioUrl);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleRandomJourney = () => {
        const currentYear = new Date().getFullYear();
        const randomYear = Math.floor(Math.random() * (currentYear - 1801 + 1)) + 1801;
        const randomLocationIndex = Math.floor(Math.random() * locations.length);
        const randomLocation = locations[randomLocationIndex];

        setYear(randomYear.toString());
        setLocation(randomLocation);
    };

    const currentYear = new Date().getFullYear();

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // --- Event Handlers for Audio ---
    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            setCurrentTime(0);
        }
    };

    const handleSeek = (e) => {
        if (audioRef.current) {
            const seekTime = parseFloat(e.target.value);
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleMuteToggle = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        if (audioRef.current) {
            audioRef.current.muted = newMutedState; // Use the built-in muted property
        }
    };

    const handlePlaybackRateChange = (e) => {
        const newRate = parseFloat(e.target.value);
        setPlaybackRate(newRate);
        if (audioRef.current) {
            audioRef.current.playbackRate = newRate;
        }
    };


    return (
        <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <header className="bg-palestine-white dark:bg-palestine-black shadow-md py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="text-center flex-grow">
                        <h1 className="text-3xl font-bold text-palestine-black dark:text-palestine-white">{translations[language].title}</h1>
                        <p className="text-palestine-black dark:text-palestine-white">{translations[language].subtitle}</p>
                    </div>
                    <div className='flex space-x-4'>
                        <button
                            onClick={toggleLanguage}
                            className="px-4 py-2 text-palestine-black dark:text-palestine-white focus:outline-none"
                        >
                            {language === 'en' ? 'عربي' : 'English'}
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="px-4 py-2 text-palestine-black dark:text-palestine-white focus:outline-none"
                        >
                            {theme === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto mt-8 p-4">
                <div className="bg-palestine-white dark:bg-palestine-black rounded-lg shadow-lg p-6">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-palestine-black dark:text-palestine-white text-sm font-bold mb-2">{translations[language].nameLabel}</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-palestine-black dark:text-palestine-white leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
                            placeholder={translations[language].namePlaceholder}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="age" className="block text-palestine-black dark:text-palestine-white text-sm font-bold mb-2">{translations[language].ageLabel}</label>
                        <input
                            type="number"
                            id="age"
                            min="1"
                            value={age}
                            onChange={(e) => {
                                let newValue = parseInt(e.target.value, 10);
                                if (isNaN(newValue)) {
                                    setAge('');
                                } else if (newValue < 1) {
                                    setAge('1');
                                } else {
                                    setAge(e.target.value);
                                }
                            }}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-palestine-black dark:text-palestine-white leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
                            placeholder={translations[language].agePlaceholder}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="occupation" className="block text-palestine-black dark:text-palestine-white text-sm font-bold mb-2">{translations[language].occupationLabel}</label>
                        <input
                            type="text"
                            id="occupation"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-palestine-black dark:text-palestine-white leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
                            placeholder={translations[language].occupationPlaceholder}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-palestine-black dark:text-palestine-white text-sm font-bold mb-2">{translations[language].genderLabel}</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-palestine-black dark:text-palestine-white leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
                        >
                            <option value="" disabled>{translations[language].genderPlaceholder}</option>
                            {language === 'en'
                                ? genders.map((gen) => (
                                    <option key={gen} value={gen}>{gen}</option>
                                ))
                                : arabicGenders.map((gen, index) => (
                                    <option key={genders[index]} value={genders[index]}>{gen}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="year" className="block text-palestine-black dark:text-palestine-white text-sm font-bold mb-2">{translations[language].yearLabel}</label>
                        <input
                            type="number"
                            id="year"
                            min="1800"
                            max={currentYear}
                            value={year}
                            onChange={(e) => {
                                let newValue = parseInt(e.target.value, 10);
                                if (isNaN(newValue)) {
                                    setYear(''); // Allow empty input
                                } else if (newValue < 1800) {
                                    setYear('1800');
                                } else if (newValue > currentYear) {
                                    setYear(currentYear.toString());
                                } else {
                                    setYear(e.target.value);
                                }
                            }}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-palestine-black dark:text-palestine-white leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
                            placeholder={translations[language].yearPlaceholder}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-palestine-black dark:text-palestine-white text-sm font-bold mb-2">{translations[language].locationLabel}</label>
                        <select
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-palestine-black dark:text-palestine-white leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700"
                        >
                            <option value="" disabled>{translations[language].locationPlaceholder}</option>
                            {language === 'en'
                                ? locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))
                                : arabicLocations.map((loc, index) => (
                                    <option key={locations[index]} value={locations[index]}>{loc}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex space-x-4 mb-4">
                        <button
                            onClick={handleTravel}
                            disabled={loading}
                            className="bg-palestine-green hover:bg-green-700 text-palestine-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {loading ? translations[language].travelingButton : translations[language].travelButton}
                        </button>
                        <button
                            onClick={handleRandomJourney}
                            className="bg-palestine-red hover:bg-red-700 text-palestine-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {translations[language].randomButton}
                        </button>
                    </div>

                    {loading && <div className="text-center"><p className="text-palestine-black dark:text-palestine-white">{translations[language].loadingText}</p></div>}
                    {error && <div className="text-red-500 dark:text-red-400">{error}</div>}

                    {narrative && (
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold text-palestine-black dark:text-palestine-white mb-4">{translations[language].narrativeTitle}</h2>
                            <p className="text-palestine-black dark:text-palestine-white">{narrative}</p>
                        </div>
                    )}

                    {image && (
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold text-palestine-black dark:text-palestine-white mb-4">{translations[language].imageTitle}</h2>
                            <img src={`data:image/png;base64,${image}`} alt="Generated scene" className="w-full rounded-lg" />
                        </div>
                    )}

          {/* Audio Player Controls */}
          {audioUrl && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-palestine-black dark:text-palestine-white mb-4">{translations[language].audioTitle}</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-palestine-black dark:text-palestine-white font-bold py-2 px-4 rounded"
                >
                  {isPlaying ? translations[language].pauseAudio : translations[language].playAudio}
                </button>
                <button
                  onClick={handleStop}
                  className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-palestine-black dark:text-palestine-white font-bold py-2 px-4 rounded"
                >
                  {translations[language].stopAudio}
                </button>
                <button
                  onClick={handleMuteToggle}
                  className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-palestine-black dark:text-palestine-white font-bold py-2 px-4 rounded"
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-32"
                />
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={playbackRate}
                  onChange={handlePlaybackRateChange}
                  className="w-32"
                />
                <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />

                <div>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              <audio
                ref={audioRef}
                src={audioUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                // No 'hidden' attribute needed; controls are sufficient
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;