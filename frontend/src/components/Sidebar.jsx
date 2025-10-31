import React, { use, useRef } from 'react'
import { sidebarStyles } from '../assets/dummyStyle'
import questionsData from '../assets/dummydata'
import { ToastContainer, toast } from 'react-toastify'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, BookOpen, Check, CheckCircle, ChevronDown, ChevronRight, Code, Coffee, Cpu, Database, Globe, icons, Layout, Menu, SidebarIcon, Sparkle, Sparkles, Star, Target, Terminal, Trophy, X, XCircle, Zap } from 'lucide-react';

const API_BASE = "http://localhost:5000";
const Sidebar = () => {

    const [selectedTech, setSelectedTech] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false)
    const submittedRef = useRef(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const asideRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {

            if (window.innerWidth >= 768) setIsSidebarOpen(true);
            else setIsSidebarOpen(false);
        }
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    useEffect(() => {

        if (window.innerWidth < 768) {
            if (isSidebarOpen) document.body.style.overflow = "hidden";
            else document.body.style.overflow = "";

        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isSidebarOpen]);

    const technologies = [
        {
            id: "html",
            name: "HTML",
            icon: <Globe size={20} />,
            color: "bg-orange-50 text-orange-600 border-orange-200",
        }, {
            id: "css",
            name: "CSS",
            icon: <Layout size={20} />,
            color: "bg-blue-50 text-blue-600 border-blue-200"
        },
        {
            id: "js",
            name: "JavaScript",
            icon: <Code size={20} />,
            color: "bg-yellow-50 text-yellow-600 border-yellow-200",
        },
        {
            id: "react",
            name: "React",
            icon: <Cpu size={20} />,
            color: "bg-cyan-50 text-cyan-600 border-cyan-200",
        },
        {

            id: "node",
            name: "Node.js",
            icon: <Code size={20} />,
            color: "bg-green-50 text-green-600 border-green-200"
        },
        {
            id: "mongodb",
            name: "MongoDB",
            icon: <Database size={20} />,
            color: "bg-emerald-50 text-emerald-600 border-emerald-200"
        },
        {
            id: "java",
            name: "Java",
            icon: <Coffee size={20} />,
            color: "bg-red-50 text-red-600 border-red-200"
        },
        {
            id: "python",
            name: "Python",
            icon: <Terminal size={20} />,
            color: "bg-indigo-50 text-indigo-600 border-indigo-200"
        },
        {
            id: "cpp",
            name: "C++",
            icon: <Code size={20} />,
            color: "bg-purple-50 text-purple-600 border-purple-200"
        },
        {
            id: "bootstrap",
            name: "Bootstrap",
            icon: <Layout size={20} />,
            color: "bg-pink-50 text-pink-600 border-pink-200"
        },
    ]

    const levels = [

        {
            id: "basic",
            name: "Basic",
            questions: 20,
            icons: <Star size={16} />,
            color: "bg-green-50 text-green-600 "
        },
        { id: "intermediate", name: "Intermediate", questions: 40, icons: <Zap size={16} />, color: "bg-yellow-50 text-yellow-600 " },

        { id: "advanced", name: "Advanced", questions: 60, icons: <Target size={16} />, color: "bg-orange-50 text-orange-600 " },
    ];


    const handleTechSelect = (techId) => {

        if (selectedTech === techId) {
            setSelectedTech(null);
            setSelectedLevel(null);

        } else {
            setSelectedTech(techId);
            setSelectedLevel(null);
        }

        setCurrentQuestion(0);
        setUserAnswers({});
        setShowResults(false);

        submittedRef.current = false;

        if (window.innerWidth < 768) setIsSidebarOpen(true);

        setTimeout(() => {

            const el = asideRef.current?.querySelector(`[data-tech="${techId}"]`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 120);
    };

    const handleLevelSelect = (levelId) => {
        setSelectedLevel(levelId);
        setCurrentQuestion(0);
        setUserAnswers({});
        setShowResults(false);
        submittedRef.current = false;
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const HandleanswerSelect = (answerIndex) => {

        setUserAnswers((prev) => ({ ...prev, [currentQuestion]: answerIndex }));
        setTimeout(() => {
            if (currentQuestion < getQuestions().length - 1) {
                setCurrentQuestion((prev) => prev + 1);
            } else {
                setShowResults(true);
            }
        }, 500);
    };

    const getQuestions = () => {

        if (!selectedTech || !selectedLevel) return [];
        return questionsData[selectedTech]?.[selectedLevel] || [];
    };

    //calculate score
    const calculateScore = () => {
        const questions = getQuestions();
        let correct = 0;
        questions.forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                correct++;
            }
        });
        return {

            correct,
            total: questions.length,
            percentage: questions.length ? Math.round((correct / questions.length) * 100) : 0,
        };
    };
    //Rest quiz
    const resetQuiz = () => {
        setCurrentQuestion(0);
        setUserAnswers({});
        setShowResults(false);
        submittedRef.current = false;
        if (window.innerWidth < 768) setIsSidebarOpen(true);
    };
    const question = getQuestions();
    const score = calculateScore();
    const currentQ = question[currentQuestion];

    const getPerformaceStatus = () => {
        const percent = score.percentage;
        if (percent >= 90) return { text: "Outstanding", color: "text-green-600", icon: <Sparkles size={16} className='text-amber-800' /> };
        if (percent >= 75) return { text: "Excellent", color: "text-yellow-600", icon: <Trophy size={16} className='text-blue-800' /> };
        if (percent >= 60) return { text: "Good job", color: "text-yellow-600", icon: <Award size={16} className='text-green-800' /> };
        return { text: "Keep Improving", color: "text-red-600", icon: <BookOpen size={16} className='text-gray-800' /> };
    }

    const performance = getPerformaceStatus();
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    }

    const getAuthHeader = () => {
        let token = null;
        try {
            token = localStorage.getItem('authToken');
        } catch (error) {
            //ignore the error
        }
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const submitResults = async () => {
        if (submittedRef.current) return;
        if (!selectedTech || !selectedLevel) return;
        //  submittedRef.current = true;
        const payload = {
            title: `${selectedTech.toUpperCase()} - ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Quiz`,
            technology: selectedTech,
            level: selectedLevel,
            totalquestions: score.total,
            correct: score.correct,
            wrong: score.total - score.correct,
        };
        try {
            submittedRef.current = true;
            // await fetch('/api/quiz/results', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         ...getAuthHeader(),
            //     },
            //     body: JSON.stringify(payload),
            // });

            const report = await axios.post(`${API_BASE}/api/results`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                timeout: 10000,
            });
            if (report.data && report.data.success) {
                toast.success('Results submitted successfully');
            } else {
                toast.warn('Failed to submit results');
                submittedRef.current = false;
            }
        } catch (error) {
            submittedRef.current = false;
            console.error('Error submitting results:', error?.response.data || error.message || error);
            toast.error('Could not submit results. Please try again later.');
        }
    };

    useEffect(() => {
        if (showResults) {
            submitResults();
        }
    }, [showResults]);

    return (
        <div className={sidebarStyles.pageContainer}>
            {isSidebarOpen && (
                <div className={sidebarStyles.mobileOverlay} onClick={() => window.innerWidth < 786 && setIsSidebarOpen(false)}>

                </div>
            )}

            <div className={sidebarStyles.mainContainer}>
                <aside ref={asideRef} className={`${sidebarStyles.sidebar}
             ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    <div className={sidebarStyles.sidebarHeader}>
                        <div className={sidebarStyles.headerDecoration1}></div>
                        <div className={sidebarStyles.headerDecoration2}></div>
                        <div className={sidebarStyles.headerContent}>
                            <div className={sidebarStyles.logoContainer}>
                                <div className={sidebarStyles.logoIcon}>
                                    <BookOpen size={28} className='text-indigo-700' />
                                </div>
                                <div>
                                    <h1 className={sidebarStyles.logoTitle}>QuizMaster</h1>
                                    <p className={sidebarStyles.logoSubtitle}>Test Your Knowledge</p>
                                </div>
                                <button className={sidebarStyles.closeButton} onClick={toggleSidebar}>
                                    <X size={20} className='text-yellow-500' />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={sidebarStyles.sidebarContent}>
                        <div className={sidebarStyles.technologiesHeader}>
                            <h2 className={sidebarStyles.technologiesTitle}>Technologies</h2>
                            <span className={sidebarStyles.technologiesCount}>
                                {technologies.length} Options
                            </span>
                        </div>
                        {technologies.map((tech) => (
                            <div
                                key={tech.id}
                                className={sidebarStyles.techItem} data-tech={tech.id}
                            >
                                <button onClick={() => handleTechSelect(tech.id)}
                                    className={`${sidebarStyles.techButton} 
                                    ${selectedTech === tech.id ? `${sidebarStyles.techButtonSelected} ${tech.color}` : sidebarStyles.techButtonNormal}`}>
                                    <div className={sidebarStyles.techButtonContent}>
                                        <span className={`${sidebarStyles.techIcon} ${tech.color}`}>
                                            {tech.icon}
                                        </span>
                                        <span className={sidebarStyles.techName}>{tech.name}</span>
                                        {/* `${sidebarStyles.techName} ${tech.color}`   This look really beautiful im just changing the color */}
                                    </div>
                                    {selectedTech === tech.id ? (
                                        <ChevronDown size={18} className='text-gray-700 ml-2' />
                                    ) : (
                                        <ChevronRight size={18} className='text-gray-700 ml-2' />
                                    )}
                                </button>
                                {selectedTech === tech.id && (
                                    <div className={sidebarStyles.levelsContainer}>
                                        <h3 className={sidebarStyles.levelsTitle}>
                                            <span className='text-gray-500'>Select Difficulty</span>
                                            <span className={sidebarStyles.techBadge}>
                                                {technologies.find((t) => t.id === selectedTech)?.name}
                                            </span>
                                        </h3>
                                        {levels.map((level) => (
                                            <button key={level.id} onClick={() => handleLevelSelect(level.id)} className=
                                                {`${sidebarStyles.levelButton} 
                                                    ${selectedLevel === level.id ? `${level.color} ${sidebarStyles.levelButtonSelected} ` : sidebarStyles.levelButtonNormal}`}>
                                                <div className={sidebarStyles.levelButtonContent}>
                                                    <span className={`${sidebarStyles.levelIcon} ${selectedLevel ===
                                                        level.id ? 'bg-white/40' : 'bg-gray-100'}`}>
                                                        {level.icons}
                                                    </span>
                                                    <span className={sidebarStyles.levelName}>{level.name}</span>
                                                </div>
                                                <span className={sidebarStyles.levelQuestions}>
                                                    {level.questions} Qs
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={sidebarStyles.sidebarFooter}>
                        <div className={sidebarStyles.footerContent}>
                            <div className={sidebarStyles.footerContentCenter}>
                                <p>
                                    {/* &copy; 2024 QuizMaster. All rights reserved. */}
                                    Master your skills with QuizMaster!
                                </p>
                                <p className={sidebarStyles.footerHighlight}>
                                    keep Learning, Keep Growing!
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Question And answers also result */}

                <main className={sidebarStyles.mainContent}>
                    <div className={sidebarStyles.mobileHeader}>
                        <button className={sidebarStyles.mobileMenuButton} onClick={toggleSidebar}>
                            <Menu size={24} className='text-indigo-700' />
                        </button>
                        <div className={sidebarStyles.mobileTitle}>
                            {selectedTech ? (<div className={sidebarStyles.mobileTechInfo}>
                                <div className={`${sidebarStyles.mobileTechIcon} ${technologies.find((t) => t.id === selectedTech)?.color}`}>
                                    {technologies.find((t) => t.id === selectedTech)?.icon}
                                </div>

                                <div className={sidebarStyles.mobileTechText}>
                                    <div className={sidebarStyles.mobileTechName}>
                                        {technologies.find((t) => t.id === selectedTech)?.name}
                                    </div>
                                    <div className={sidebarStyles.mobileTechLevel}>
                                        {selectedLevel ? `${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} level` : 'Select Level'}
                                        {/* {selectedLevel ? levels.find((l) => l.id === selectedLevel)?.name : 'Select Level'} */}
                                    </div>
                                </div>
                            </div>
                            ) : (
                                <div className={sidebarStyles.mobilePlaceholder}>
                                    Select Technology From Menu
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedTech && !selectedLevel && (
                        <div className={sidebarStyles.mobileLevels}>
                            <div className={sidebarStyles.mobileLevelsContainer}>
                                {levels.map((level) => (
                                    <button key={level.id} onClick={() => handleLevelSelect(level.id)} className=
                                        {`${sidebarStyles.mobileLevelButton}`}>
                                        {level.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!selectedTech ? (
                        <div className={sidebarStyles.welcomeContainer}>
                            <div className={sidebarStyles.welcomeContent}>
                                <div className={sidebarStyles.welcomeIcon}>
                                    <Award size={64} className='text-indigo-700' />
                                </div>
                                <h2 className={sidebarStyles.welcomeTitle}>
                                    Welcome to QuizMaster!
                                </h2>
                                <p className={sidebarStyles.welcomeDescription}>
                                    Your one-stop solution for mastering quiz skills.
                                    Select a technology and level to begin your journey.
                                </p>
                                <div className={sidebarStyles.featuresGrid}>
                                    <div className={sidebarStyles.featureCard}>
                                        <div className={sidebarStyles.featureIcon}>
                                            <Star size={24} className='text-yellow-500' />
                                        </div>
                                        <h3 className={sidebarStyles.featureTitle}>Diverse Topics</h3>
                                        <p className={sidebarStyles.featureDescription}>
                                            Explore quizzes across various technologies and difficulty levels.
                                        </p>
                                    </div >

                                    <div className={sidebarStyles.featureCard}>
                                        <div className={sidebarStyles.featureIcon}>
                                            <Zap size={24} className='text-green-500' />
                                        </div>
                                        <h3 className={sidebarStyles.featureTitle}>Three difficulty levels</h3>
                                        <p className={sidebarStyles.featureDescription}>
                                            Basic, Intermediate, Advanced - choose your challenge!
                                        </p>
                                    </div>

                                    <div className={sidebarStyles.featureCard}>
                                        <div className={sidebarStyles.featureIcon}>
                                            <Target size={20} />
                                        </div>
                                        <h3 className={sidebarStyles.featureTitle}>Instant Feedback</h3>
                                        <p className={sidebarStyles.featureDescription}>
                                            Get real-time feedback on your answers to improve your skills.
                                        </p>
                                    </div>
                                </div>

                                    <div className={sidebarStyles.welcomePrompt}>
                                        <p className={sidebarStyles.welcomePromptText}>
                                            <Sparkles size={16} className='mr-2' />
                                            Select a technology from the sidebar to get started!
                                        </p>
                                    </div>


                            </div>
                        </div>
                    ) : !selectedLevel ? (
                        <div className={sidebarStyles.levelSelectionContainer}>
                            <div className={sidebarStyles.levelSelectionContent}>
                                <div className={`${sidebarStyles.techSelectionIcon} 
                         ${technologies.find((t) => t.id === selectedTech)?.color}`}
                                >
                                    {technologies.find((t) => t.id === selectedTech)?.icon}
                                </div>
                                <h2 className={sidebarStyles.techSelectionTitle}>
                                    {technologies.find((t) => t.id === selectedTech)?.name} Quiz
                                </h2>
                                <p className={sidebarStyles.techSelectionDescription}>
                                    Select a difficulty level to begin your journey
                                </p>
                                <div className={sidebarStyles.techSelectionPrompt}>
                                    <p className={sidebarStyles.techSelectionPromptText}>
                                        Get ready to test Your {" "}
                                        {technologies.find((t) => t.id === selectedTech)?.name}{" "} knowledge!
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : showResults ? (
                        <div className={sidebarStyles.resultsContainer}>
                            <div className={sidebarStyles.resultsContent}>
                                <div className={sidebarStyles.resultsHeader}>
                                    <div className={`${sidebarStyles.performanceIcon} ${performance.color}`}>
                                        {performance.icon}
                                    </div>
                                    <h2 className={sidebarStyles.resultsTitle}>Quiz Completed</h2>
                                    <p className={sidebarStyles.resultsSubtitle}>
                                        {/* You have completed the quiz on {technologies.find((t) => t.id === selectedTech)?.name}! */}
                                        You have completed the {selectedLevel} Level
                                    </p>
                                    <div className={`${sidebarStyles.performanceBadge} ${performance.color}`}>
                                        {performance.text}
                                    </div>
 
                                    <div className={sidebarStyles.scoreGrid}>
                                        <div className={sidebarStyles.scoreCard}>
                                            <div className={sidebarStyles.scoreIcon}>
                                                <CheckCircle size={24} />
                                            </div>
                                            <p className={sidebarStyles.scoreNumber}>
                                                {score.correct}
                                            </p>
                                            <p className={sidebarStyles.scoreLabel}>
                                                Correct Answers
                                            </p>
                                        </div>

                                        
                                        <div className={sidebarStyles.scoreCard}>
                                            <div className={sidebarStyles.scoreIcon}>
                                                <XCircle size={24} />
                                            </div>
                                            <p className={sidebarStyles.scoreNumber}>
                                                {score.total - score.correct}
                                            </p>
                                            <p className={sidebarStyles.scoreLabel}>
                                                Incorrect Answers
                                            </p>
                                        </div>
                                    </div>

                                    <div className={sidebarStyles.scoreProgress}>
                                        <div className={sidebarStyles.scoreProgressHeader}>
                                            <span className={sidebarStyles.scoreProgressTitle}>
                                                Overall Score
                                            </span>
                                            <span className={sidebarStyles.scoreProgressPercentage}>
                                                {score.percentage}%
                                            </span>
                                        </div>
                                        <div className={sidebarStyles.scoreProgressBar}>
                                            <div className={`${sidebarStyles.scoreProgressFill}
                                                   ${
                                                    score.percentage >= 75 ? 'bg-green-500' :
                                                    score.percentage >= 50 ? 'bg-yellow-500'  :
                                                    'bg-red-500'
                                                   } `} 
                                            style={{ width: `${score.percentage}%` }} />
                                      
                                        </div>
                                       </div>
                                    </div>
                                </div>
                            </div>
                    ):currentQ?(
                        <div className={sidebarStyles.quizContainer}>
                            <div className={sidebarStyles.quizHeader}>
                        <div className={sidebarStyles.quizTitleContainer}>
                        <h1 className={sidebarStyles.quizTitle}> 
                        {technologies.find((t) => t.id=== selectedTech).name} - {" "}
                        {selectedLevel.charAt(0).toUpperCase() +selectedLevel.slice(1)}{" "}
                        Level
                        </h1>
                        <span className={sidebarStyles.quizCounter}>
                        Questions {currentQuestion +1} of {question.length}
                        </span>
                        </div>

                        <div className={sidebarStyles.progressBar}>
                            <div className={sidebarStyles.progressFill}
                            style={{
                                width:`${((currentQuestion +1)/(question.length ||  1))*100}%`,
                            }} />
                            
                        </div>
                    </div>

                    <div className={sidebarStyles.questionContainer}>
                            <div className={sidebarStyles.questionHeader}>
                                <div className={sidebarStyles.questionIcon}>
                                <Target size={20} />
                                </div>
                                <h2 className={sidebarStyles.questionText}>
                                    {currentQ.question}
                                </h2>
                            </div>

                            <div className={sidebarStyles.optionsContainer}>
                                {currentQ.options.map((option, index)=>{
                                    const isSelected = userAnswers[currentQuestion] === index;
                                    const isCorrect = index === currentQ.correctAnswer;
                                    const showFeedback= userAnswers[currentQuestion] !== undefined;

                                    return(
                                        <button key={index} onClick={()=>HandleanswerSelect(index)} 
                                        disabled ={userAnswers[currentQuestion] !== undefined} className={`${sidebarStyles.optionButton}
                                        ${isSelected ? isCorrect ? sidebarStyles.optionCorrect : sidebarStyles.optionIncorrect : showFeedback && 
                                        isCorrect ? sidebarStyles.optionCorrect :sidebarStyles.optionNormal}`}>

                                            <div className={sidebarStyles.optionContent}>
                                            {showFeedback ? (
                                                isSelected ?(
                                                    isCorrect ? (
                                                        <CheckCircle size={20} className={sidebarStyles.optionIconCorrect} />
                                                    ) :
                                                    (<XCircle size={20} className={sidebarStyles.optionIconIncorrect} />)
                                                ) : isCorrect ?(<CheckCircle size={20} className={sidebarStyles.optionIconCorrect} />)
                                                : (<div className={sidebarStyles.optionIconEmpty} />)
                                            ):(<div className={sidebarStyles.optionIconEmpty}/>)}
                                            <span className={sidebarStyles.optionText}>
                                                {option}
                                            </span>
                                            </div>

                                        </button>
                                    )
                                })}
                            </div>
                    </div>
                        
                        </div>
                    ) : (
                         <div className={sidebarStyles.loadingContainer}>
                             <div className={sidebarStyles.loadingContent}>
                         <div className={sidebarStyles.loadingSpinner} />
                         <h3 className={sidebarStyles.loadingTitle}>
                             Preparing Your Quiz
                         </h3>
                         <p className={sidebarStyles.loadingDescription}>
                             Loading Question...
                         </p>
                             </div>
                         </div>
                     )}
                     </main>
 
            </div>
            <style>{sidebarStyles.customStyles}</style>
        </div>
    )
};

export default Sidebar
