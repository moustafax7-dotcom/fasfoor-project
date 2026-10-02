import { useEffect, useState } from 'react';
import Hero from '../components/home/Hero.jsx';
import MostOrdered from '../components/home/MostOrdered.jsx';
import FeaturesBar from '../components/home/FeaturesBar.jsx';
import { getBranches } from '../services/branchService.js';
import { getItems } from '../services/itemService.js';

const Home = () => {
  const [branches, setBranches] = useState([]);
  const [mostOrdered, setMostOrdered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([getBranches(), getItems({ availableOnly: true })])
      .then(([branchesRes, itemsRes]) => {
        if (!mounted) return;
        setBranches(branchesRes.data || []);
        setMostOrdered((itemsRes.data || []).filter((i) => i.isMostOrdered));
      })
      .catch(() => mounted && setError('تعذر تحميل بيانات الرئيسية، برجاء المحاولة لاحقًا'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="page-loading">جاري التحميل...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <main className="home-page">
      <Hero branches={branches} />
      <MostOrdered items={mostOrdered} />
      <FeaturesBar />
    </main>
  );
};
export default Home;
