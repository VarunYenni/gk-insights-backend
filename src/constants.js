export const SUM_MODEL = 'google/pegasus-xsum';

export const UPSC_TOPICS = {
    polity: [
        'constitution', 'parliament', 'bill', 'ordinance', 'president of india',
        'supreme court', 'high court', 'judiciary', 'election commission', 'court',
        'panchayati raj', 'fundamental rights', 'directive principles', "human rights",
        'fundamental duties', 'amendment', 'separation of powers', 'checks and balances',
        "forest rights", 'right to information', 'right to education', 'right to privacy',
        'governor', 'cabinet', 'niti aayog', 'federalism', 'article ', 'democracy',
        'schedule ', 'union list', 'state list', 'concurrent list', 'model code of conduct'
    ],
    economy: [
        'gdp', 'inflation', 'fiscal deficit', 'monetary policy', 'repo rate', 'sanction', 'sanctions',
        'reverse repo', 'rbi', 'gst', 'npas', 'budget', 'economic survey', 'investment',
        'employment rate', 'poverty line', 'disinvestment', 'msme', 'startup india', 'bullish', 'bearish',
        'current account deficit', 'balance of payments', 'atmanirbhar', 'make in india',
        'ease of doing business', 'blue economy', 'agricultural reforms', 'stock market', 'Indian markets'
    ],
    environment: [
        'climate change', 'global warming', 'carbon emissions', 'unfccc',
        'cop28', 'ipcc report', 'biodiversity', 'wildlife', 'national park',
        'biosphere reserve', 'ecology', 'pollution', 'forest cover',
        'eia', 'environment impact assessment', 'plastic ban', 'ozone layer',
        'campa fund', 'project tiger', 'project elephant', 'man-animal conflict'
    ],
    science: [
        'isro', 'gaganyaan', 'drdo', 'nuclear reactor', 'space mission',
        'vaccine', 'dna', 'rna', 'crispr', 'stem cell', 'quantum computing',
        'blockchain', 'ai ', 'artificial intelligence', 'machine learning', 'IISC',
        'gravitational waves', 'fusion energy', '5g', 'semiconductors', "ISS",
    ],
    international: [
        'g20', 'brics', 'quad', 'saarc', 'united nations', 'imf', 'world bank', 'war',
        'wto', 'indo-pacific', 'foreign minister', 'external affairs',
        'strategic partnership', 'bilateral relations', 'state visit', 'president visit',
        'diplomatic mission', 'diplomatic ties', 'foreign policy', 'mea', 'countries',
        'india-ghana', 'international diplomacy', 'UAE', 'USA', 'china', 'russia', 'nepal', 'bhutan', 'sri lanka',
    ],
    social: [
        'poverty', 'inequality', 'urbanisation', 'nrega', 'sdgs', 'human development',
        'literacy rate', 'malnutrition', 'tribal', 'gender equality',
        'child marriage', 'domestic violence', 'women empowerment', 'disability rights',
        'transgender', 'minority rights', 'marginalised', 'civil society',
        'education policy', 'health policy', 'digital divide', 'social welfare'
    ],
    ethics: [
        'ethics', 'integrity', 'probity', 'moral', 'code of conduct',
        'transparency', 'accountability', 'governance', 'public servant',
        'citizen charter', 'attitude', 'empathy', 'leadership', 'emotional intelligence'
    ],
    culture: [
        'unesco', 'heritage site', 'buddhism', 'jainism', 'vedic',
        'indus valley', 'bhakti movement', 'sufi movement', 'tourism',
        'folk dance', 'classical dance', 'mural painting', 'tribal art',
        'indian painting', 'culture ministry', 'archaeological survey of india',
        'festival', 'padma award', 'bharat ratna', 'yakshagana', 'bharatanatyam'
    ],
    governance: [
        'digital india', 'e-governance', 'good governance', 'rtie',
        'lokpal', 'lokayukta', 'civil services', 'citizen centric services',
        'audit', 'transparency', 'social audit', 'dbt', 'aadhaar', 'public accountability'
    ],
    internalSecurity: [
        'naxalism', 'cybersecurity', 'terrorism', 'insurgency', 'terrorist attack', 'war',
        'border management', 'afspa', 'counter terrorism', 'terrorist', 'police', 'military', 'defence'
        'internal security', 'itbp', 'bodo', 'manipur violence', 'army', 'blast', 'bomb',
        'radicalisation', 'militancy', 'left wing extremism', 'bodo', 'bsf', 'nsa', 'missiles'
    ],
    disaster: [
        'disaster management', 'cyclone', 'earthquake', 'flood',
        'ndrf', 'sdma', 'natural disaster', 'man-made disaster',
        'heatwave', 'landslide', 'avalanche', 'draught', 'tsunami', 'disaster risk reduction'
    ],
    schemes: [
        'pm awas yojana', 'pm kisan', 'jal jeevan mission', 'swachh bharat',
        'ujjwala', 'ayushman bharat', 'startup india', 'skill india',
        'jan dhan', 'beti bachao', 'atma nirbhar', 'mission shakti', 'digital health mission'
    ],
    prelims_facts: [
        'first in india', 'latest census', 'report released by',
        'tribe name', 'animal species', 'space launch', 'defence exercise',
        'index ranking', 'mission launched', 'india innovation index', 'report of niti aayog'
    ],
    internalAffairs: [
        'cabinet reshuffle', 'new policy', 'government scheme', 'central government', 'capitalist',
        'parliament session', 'budget session', 'presidential address', 'election', 'elections', "ministry",
        'governor address', 'state assembly', 'legislative assembly', 'CM', 'minister', "union minister",
        'parliamentary committee', 'standing committee', 'select committee', 'bureaucrats', "union government",
        'government resolution', 'ordinance promulgated', 'india', 'J&K', 'ladakh', 'Jammu and Kashmir',
    ],
    technology: [
        'artificial intelligence', 'machine learning', 'blockchain', 'quantum computing',
        '5g technology', 'internet of things', 'cybersecurity', 'cloud computing',
        'augmented reality', 'virtual reality', 'big data', 'data privacy',
        'biotechnology', 'genomics', 'nanotechnology', 'renewable energy', 'iit', 'nit',
        'solar power', 'wind energy', 'hydrogen fuel cells', 'electric vehicles', 'apple',
        'google', 'microsoft', 'tesla', 'meta', 'amazon', 'nvidia', 'openai'
    ],
    banking: [
        'rbi',
    ]
};

export const NEWS_API_SOURCES = [
    'the-hindu','the-times-of-india','hindustan-times', 'the-indian-express','news18-com'
];

export const RSS_FEEDS = [
    'https://indianexpress.com/section/india/feed/',
    'https://www.thehindu.com/news/national/feeder/default.rss',
    'https://cfo.economictimes.indiatimes.com/rss/topstories',
    'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    'https://www.thehindu.com/news/international/feeder/default.rss',
    'https://feeds.feedburner.com/ndtvnews-top-stories',
    'https://www.indiatoday.in/rss/1206578',
    'https://www.firstpost.com/commonfeeds/v1/mfp/rss/web-stories.xml'
];