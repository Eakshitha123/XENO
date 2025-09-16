import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CampaignCreate() {
  const [rules, setRules] = useState([{ field: "", operator: "", value: "", condition: "AND" }]);
  const [audienceSize, setAudienceSize] = useState(null);
  const [campaignObjective, setCampaignObjective] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Add a new empty rule
  const addRule = () => {
    setRules([...rules, { field: "", operator: "", value: "", condition: "AND" }]);
  };

  // Remove a rule by index
  const removeRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  // Update rule values
  const updateRule = (index, key, value) => {
    const newRules = [...rules];
    newRules[index][key] = value;
    setRules(newRules);
  };

  // Preview audience
  const previewAudience = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/campaigns/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      });
      const data = await res.json();
      setAudienceSize(data.audience_size);
    } catch (err) {
      console.error(err);
    }
  };

  // Save campaign
  const saveCampaign = async () => {
    try {
      await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules, audience_size: audienceSize }),
      });
      navigate("/history");
    } catch (err) {
      console.error(err);
    }
  };

  // AI Message Suggestions
  const getAISuggestions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ai/message-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective: campaignObjective }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Create Campaign</h2>

      {/* Campaign Objective for AI */}
      <input
        type="text"
        placeholder="Campaign Objective (for AI suggestions)"
        value={campaignObjective}
        onChange={(e) => setCampaignObjective(e.target.value)}
      />
      <button onClick={getAISuggestions}>Get AI Suggestions</button>

      {/* Display AI Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h4>AI Message Suggestions:</h4>
          <ul>
            {suggestions.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {rules.map((rule, index) => (
        <div key={index} className="rule-row">
          {/* Field dropdown */}
          <select value={rule.field} onChange={(e) => updateRule(index, "field", e.target.value)}>
            <option value="">Select Field</option>
            <option value="total_spend">Total Spend</option>
            <option value="visits">Visits</option>
            <option value="last_order_date">Last Order Date</option>
          </select>

          {/* Operator dropdown */}
          <select value={rule.operator} onChange={(e) => updateRule(index, "operator", e.target.value)}>
            <option value="">Select Operator</option>
            <option value="$gt">{">"}</option>
            <option value="$lt">{"<"}</option>
            <option value="$eq">{"="}</option>
          </select>

          {/* Value input */}
          <input type="text" placeholder="Value" value={rule.value} onChange={(e) => updateRule(index, "value", e.target.value)} />

          {/* Condition dropdown */}
          <select value={rule.condition} onChange={(e) => updateRule(index, "condition", e.target.value)}>
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>

          <button onClick={() => removeRule(index)}>Remove</button>
        </div>
      ))}

      <button onClick={addRule}>Add Rule</button>
      <br />
      <button onClick={previewAudience}>Preview Audience</button>
      {audienceSize !== null && <p>Audience Size: {audienceSize}</p>}
      <button onClick={saveCampaign}>Save Campaign</button>
    </div>
  );
}

export default CampaignCreate;
