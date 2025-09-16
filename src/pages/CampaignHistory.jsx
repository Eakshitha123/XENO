import React, { useEffect, useState } from "react";

function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/campaigns");
        const data = await res.json();
        // Sort newest first
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCampaigns(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div>
      <h2>Campaign History</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Audience Size</th>
              <th>Sent</th>
              <th>Failed</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id}>
                <td>{c.audience_size || c.audienceSize}</td>
                <td>{c.sent}</td>
                <td>{c.failed}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CampaignHistory;
