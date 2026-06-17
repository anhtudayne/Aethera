const StatsSection = () => {
  const stats = [
    { label: 'Global Students', value: '10K+' },
    { label: 'Premium Courses', value: '500+' },
    { label: 'Completion Rate', value: '99.8%' },
    { label: 'Support SLA', value: '24/7' },
  ];

  return (
    <section className="home-section stats-banner-wrapper">
      <div className="container">
        <div className="stats-grid-row">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item-box">
              <span className="stat-number">
                {stat.value}
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
