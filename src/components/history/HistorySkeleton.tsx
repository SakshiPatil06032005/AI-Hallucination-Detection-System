export function HistorySkeleton() { return <div className="history-skeleton-list">{[1, 2, 3].map((item) => <div className="history-skeleton" key={item}><i /><i /><i /><i /></div>)}</div>; }
