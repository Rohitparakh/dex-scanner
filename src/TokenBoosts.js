import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TokenBoosts.css'; // Import the CSS file

const TokenBoosts = () => {
    const [tokens, setTokens] = useState([]);
    const [filteredTokens, setFilteredTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [boostFilter, setBoostFilter] = useState(0);
    const [chainIdFilter, setChainIdFilter] = useState('');

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await axios.get('https://api.dexscreener.com/token-boosts/latest/v1');
                const uniqueTokens = Array.from(
                    new Map(response.data.map(token => [token.tokenAddress, token])).values()
                );
                setTokens(uniqueTokens);
                setFilteredTokens(uniqueTokens);                
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchTokens();
    }, []);

    useEffect(()=>{
        console.log(tokens)
    },[tokens])
    useEffect(()=>{
        console.log(filteredTokens)
    },[filteredTokens])

    const handleFilterChange = () => {
        let filtered = tokens;

        if (boostFilter>0) {
            filtered = filtered.filter(token => token.totalAmount >= boostFilter);
        }

        if (chainIdFilter) {
            filtered = filtered.filter(token => token.chainId === chainIdFilter);
        }

        // Remove duplicates based on tokenAddress
        const uniqueFilteredTokens = Array.from(
            new Map(filtered.map(token => [token.tokenAddress, token])).values()
        );

        setFilteredTokens(uniqueFilteredTokens);
    };

    // Extract unique Chain IDs for the filter
    const uniqueChainIds = [...new Set(tokens.map(token => token.chainId))];

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error fetching tokens: {error.message}</div>;

    return (
        <div className="token-boosts">
            <h1>Token Boosts</h1>
            <p><a href="rohcodes.com">-by Rohcodes</a></p>
            <div className="filters">
                <label>
                    Boost Filter:
                    <input
                        type="number"
                        value={boostFilter}
                        onChange={(e) => setBoostFilter(e.target.value)}
                        placeholder="Minimum Boost"
                    />
                </label>
                <label>
                    Chain ID Filter:
                    <select
                        value={chainIdFilter}
                        onChange={(e) => setChainIdFilter(e.target.value)}
                    >
                        <option value="">Select Chain ID</option>
                        {uniqueChainIds.map(chainId => (
                            <option key={chainId} value={chainId}>{chainId}</option>
                        ))}
                    </select>
                </label>
                <button onClick={handleFilterChange}>Apply Filters</button>
            </div>
            <ul className="token-list">
                {filteredTokens.map(token => (
                    <li key={`${token.tokenAddress}`} className="token-item">
                        <img src={token.icon} alt={`${token.name} icon`} className="token-icon" />
                        <div className="token-details">
                            <p><span>Total Boosts: {token.totalAmount}</span></p>
                            <p><span>Boosts: {token.amount}</span></p>
                            <p><span>Chain: {token.chainId}</span></p>
                            <p><span>Token Address: {token.tokenAddress}</span></p>
                            <p><span>Description: {token.description}</span></p>
                            {/* Remove time part from date */}
                            <ul className="links">
                                {token?.links?.map(link => (
                                    <li key={`${link.url}-${token.tokenAddress}`}>
                                        {link.label ? link.label : link.type}: 
                                        <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                                    </li>
                                ))}
                            </ul>
                            {/* Add View Dexscreener Button */}
                            <a 
                                href={token.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="view-dex-button"
                            >
                                View Dexscreener
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TokenBoosts;