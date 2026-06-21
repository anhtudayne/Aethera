import AnimatedCounter from '../../components/common/AnimatedCounter/AnimatedCounter';

const StatsSection = () => {
  const stats = [
    { label: 'Global Students', target: 10, suffix: 'K+' },
    { label: 'Premium Courses', target: 500, suffix: '+' },
    { label: 'Completion Rate', target: 99.8, decimals: 1, suffix: '%' },
    { label: 'Support SLA', target: 24, suffix: '/7' },
  ];

  return (
    <section className="home-section stats-banner-wrapper">
      <div className="container">
        <div className="stats-grid-row">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item-box">
              <span className="stat-number">
                <AnimatedCounter 
                  to={stat.target} 
                  suffix={stat.suffix} 
                  decimals={stat.decimals || 0} 
                  duration={1.8}
                />
              </span>
              <span className="stat-title-label">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

