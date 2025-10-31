import React ,{useCallback, useMemo, useEffect ,useState} from 'react'
import { resultStyles } from '../assets/dummyStyle'
import axios from 'axios';
import { toast } from 'react-toastify';
import {Badge} from 'lucide-react'

const badge = ({percent}) => {
  if(percent>=85) return <span style={resultStyles.badgeExcellent}>Excellent</span>
  if(percent>=65) return <span style={resultStyles.badgeGood}>Good</span>
  if(percent>=45) return <span style={resultStyles.badgeAverage}>Average</span>
  return <span style={resultStyles.badgeNeedsWork}>Needs Work</span>
};

const MyResult = ({apiBase = 'http://localhost:5000'}) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [technologies, setTechnologies] = useState([]);

const getauthHeader = useCallback(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }, []);
// Fetch result data on component mount or technology change
  useEffect(() => {
    let mounted = true;
    const fetchResult = async (tech = 'all') => {
      setLoading(true);
      setError(null);
      try {
        const q = tech && tech.toLowerCase() !== 'all' ? `?technology=${encodeURIComponent(tech)}` : '';

        const response = await axios.get(`${apiBase}/api/results${q}`, {
          headers:{"content-type": "application/json", ...getauthHeader()},
          timeout : 5000
        });
        console.log('📊 Fetch Results Response:', response.data);
        if (!mounted) 
          return;
        if (response.status === 200 && response.data && response.data.success) {
          setResults(Array.isArray(response.data.results) ? response.data.results : []);
          console.log('✅ Results set:', response.data.results);
        }
        else{
          setResults([]);
          console.warn('⚠️ Unexpected response:', response.data);
          toast.warn('Unexpected response from server while fetching results.');
        }
      } catch (err) {
        console.error('❌ Error fetching results:', err?.response?.data || err.message || err);
        if (!mounted) return;
        if(err?.response?.status !== 401){
          setError('Not authorized to view results. Please log in.');
          toast.warn('Not authorized to view results. Please log in.');
        }else{
          setError('Could not fetch results. Please try again later.');
          toast.warn('Could not fetch results from server.');
          setResults([]);
        }
      } finally {
       if(mounted) setLoading(false);
      }
    };


    fetchResult(selectedTechnology);
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, selectedTechnology, getauthHeader]);


  //fetch all results once(or when api base changes) to build a list of technologies
  useEffect(() => {
    let mounted = true;
    const fetchAllResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${apiBase}/api/results`, {
          headers: { "content-type": "application/json", ...getauthHeader() },
          timeout: 5000
        });
        console.log('🔍 Fetch Technologies Response:', response.data);
        if (!mounted) return;
        if (response.status === 200 && response.data && response.data.success) {
          const all = Array.isArray(response.data.technologies) ? response.data.technologies : [];
          const set = new Set();
          all.forEach(r => { if (r.technology) set.add(r.technology); });
          const arr = Array.from(set).sort((a, b) => a.localeCompare(b));
          setTechnologies(['all', ...arr]);
          console.log('🏷️ Technologies extracted:', arr);
        } else {
          console.warn('⚠️ No technologies in response');
        }
      } catch (err) {
        console.error('Error fetching technologies:', err?.response?.data || err.message || err)
      }
    };

    fetchAllResults();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, getauthHeader]);


 const makeKey = (r) => (r._id ? r._id : `${r.id || ''}_${r.title || ''}`);

const summary = useMemo(() => {
  const source = Array.isArray(results) ? results : [];
  console.log('📈 Computing summary from results:', source);

  const totalQs = source.reduce(
    (s, r) => s + (Number(r.totalQuestions) || 0),
    0
  );

  const totalCorrect = source.reduce(
    (s, r) => s + (Number(r.correct) || 0),
    0
  );

  const totalWrong = source.reduce(
    (s, r) => s + (Number(r.wrong) || 0),
    0
  );

  const pct = totalQs ? Math.round((totalCorrect / totalQs) * 100) : 0;

  console.log('📊 Summary computed:', { totalQs, totalCorrect, totalWrong, pct });
  return { totalQs, totalCorrect, totalWrong, pct };
}, [results]);

const grouped = useMemo(() => {
  const src = Array.isArray(results) ? results : [];

  const map = {};
  src.forEach((r) => {
    const track = (r.title || "").split(" ")[0] || "General";
    if (!map[track]) map[track] = [];
    map[track].push(r);
  });
  console.log('📦 Grouped results by track:', map);
  return map;
}, [results]);

const handleSelectTech = (tech) => {
  setSelectedTechnology(tech || 'all')
  console.log('🔧 Technology selected:', tech);
}



  return (
    <div className={resultStyles.pageContainer}>
     <div className={resultStyles.container}>
    <header className={resultStyles.header}>
    <div>
      <h1 className={resultStyles.title}>
    Quiz Results
      </h1>
      <div className={resultStyles.headerControls}/>
    </div>
    </header>
    <div className={resultStyles.filterContainer}>
          <div className={resultStyles.filterContent}>
            <div className={resultStyles.filterButtons}>
            <span className={resultStyles.filterLabel}>Filter by Tech:</span>

            <button onClick={()=>handleSelectTech('all')} className={`${resultStyles.filterButton}
             ${selectedTechnology === 'all' 
              ? resultStyles.filterButtonActive 
              : resultStyles.filterButtonInactive}`}>
              All
              </button>
              
            {technologies.map((tech) => (
              <button key={tech} onClick={() => handleSelectTech(tech)} 
              className={`${resultStyles.filterButton}
               ${selectedTechnology === tech 
               ? resultStyles.filterButtonActive 
               : resultStyles.filterButtonInactive}`}>
               {tech}
              </button>
            ))}

            {/* if we dont yet have technologies but result exists , derive from current results*/}
            {!technologies.length===0 && Array.isArray(results) && results.length > 0 &&
            [...new Set(results.map(r => r.technology).filter(Boolean))].map((tech) => (
              <button key={`fallback-${tech}`} onClick={() => handleSelectTech(tech)} 
              className={`${resultStyles.filterButton}
               ${selectedTechnology === tech 
               ? resultStyles.filterButtonActive 
               : resultStyles.filterButtonInactive}`}
               aria-pressed={selectedTechnology === tech}>
               {tech}
              </button>
            ))}
            </div>


            <div className={resultStyles.filterStatus}>
            {selectedTechnology === 'all' ? 'Showing all technologies' : `Filtering : ${selectedTechnology}`}
            </div>
          </div>
    </div>
    {loading ? (
      <div className={resultStyles.loadingContainer}>
        <div className={resultStyles.loadingSpinner}/>
            <div className={resultStyles.loadingText}>
              Loading results...
            </div>
        </div>
    ) : (
      <>
      {Object.entries(grouped).map(([track, items]) => (
        <section key={track} className={resultStyles.trackSection}>
          <h2 className={resultStyles.trackTitle}>{track} Track</h2>
          <div className={resultStyles.resultsGrid}>
            {items.map((result) => (
              <StripCard key={makeKey(result)} item={result} />
            ))}
          </div>
        </section>
      ))}
      {Array.isArray(results) && results.length === 0 && !error && (
        <div className={resultStyles.emptyState}>
          No results found for the selected technology.
        </div>
      )}
    </>
  )}
  </div>
    </div>
  )
}
//strip card component
function StripCard({ item }) {
  const percent = item.totalQuestions
    ? Math.round((Number(item.correct) / Number(item.totalQuestions)) * 100)
    : 0;
  const getLevel = (it) => {
    const id = (it.id || "").toString().toLowerCase();
    const title = (it.title || "").toString().toLowerCase();
    if (id.includes("basic") || title.includes("basic"))
      return { letter: "B", style: resultStyles.levelBasic };

    if (id.includes("intermediate") || title.includes("intermediate"))
      return { letter: "I", style: resultStyles.levelIntermediate };

    return { letter: "A", style: resultStyles.levelAdvanced };
  };
  const level = getLevel(item);
  return (
    <article className={resultStyles.card}>
      <div className={resultStyles.cardAccent}></div>

      <div className={resultStyles.cardContent}>
          <div className={resultStyles.cardHeader}>
              <div className={resultStyles.cardInfo}>
                  <div className={`${resultStyles.levelAvatar} ${level.style}`}>
                      {level.letter}
                  </div>
                  <div className={resultStyles.cardText}>
                    <h2 className={resultStyles.cardTitle}>
                    {item.title}
                    </h2>

                    <div className={resultStyles.cardMeta}>
                      {item.totalQuestions} Qs
                      {item.timeSpent ? ` • ${item.timeSpent} secs` : ''}
                    </div>
                  </div>
              </div>
              <div className={resultStyles.cardPerformance}>
              <div className={resultStyles.performanceLabel}>
                Perfomance
              </div>
              <div className={resultStyles.badgeContainer}>
                  <Badge percent = {percent}/>
              </div>
              </div>
          </div>
          <div className={resultStyles.cardStats}>

            <div className={resultStyles.statItem}>
              Correct:  <span className={resultStyles.statNumber}>{item.correct} </span>
            </div>

            <div className={resultStyles.statItem}>
              Wrong:  <span className={resultStyles.statNumber}>{item.wrong} </span>
            </div>

            <div className={resultStyles.statItem}>
              score:  <span className={resultStyles.statNumber}>{percent}% </span>
            </div>

          </div>
      </div>
    </article>
  )
}


export default MyResult
