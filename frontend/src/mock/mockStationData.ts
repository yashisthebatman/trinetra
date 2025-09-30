export interface Reply {
  id: string;
  author: string;
  text: string;
}

export interface Comment {
  id: string;
  text: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  importance: 'Critical' | 'High' | 'Medium' | 'Low'; // NEW: Add importance level
  upvotes: number;
  downvotes: number;
  replies: Reply[];
}

export interface StationAnalysis {
  overallSentiment: 'Predominantly Negative' | 'Predominantly Positive' | 'Mixed';
  summary: string;
}

export interface Station {
  id: string;
  name: string;
  comments: Comment[];
  analysis: StationAnalysis; 
}

const stationData: Record<string, Station> = {
  'palarivattom': {
    id: 'palarivattom',
    name: 'Palarivattom Station',
    comments: [
      { id: 'c3', text: 'Why is the north-side escalator broken again? This has been a recurring issue for months.', sentiment: 'Negative', importance: 'Critical', upvotes: 5, downvotes: 22, replies: [] },
      { id: 'c1', text: 'The ticketing counter is always understaffed. The wait times are unacceptable during peak hours.', sentiment: 'Negative', importance: 'High', upvotes: 2, downvotes: 15, replies: [] },
      { id: 'c5', text: 'More dustbins are needed near the entrance. The current ones are always overflowing.', sentiment: 'Negative', importance: 'Medium', upvotes: 18, downvotes: 3, replies: [] },
      { id: 'c2', text: 'Platform 2 is surprisingly clean and well-maintained. Good job by the cleaning crew.', sentiment: 'Positive', importance: 'Low', upvotes: 25, downvotes: 1, replies: [{ id: 'r1', author: 'S. Analyst', text: 'Good to hear. Forwarding this feedback to the maintenance supervisor.' }] },
      { id: 'c4', text: 'The train arrived exactly on time as per the schedule.', sentiment: 'Neutral', importance: 'Low', upvotes: 8, downvotes: 0, replies: [] },
    ],
    analysis: {
      overallSentiment: 'Predominantly Negative',
      summary: 'Feedback indicates significant operational issues that detract from the passenger experience, with recurring maintenance failures being the most critical point of feedback.',
    }
  },
  'kaloor': {
    id: 'kaloor',
    name: 'Kaloor Stadium Station',
    comments: [
      { id: 'c7', text: 'The announcement system is unclear and the volume is too low. Hard to hear which train is arriving.', sentiment: 'Negative', importance: 'High', upvotes: 7, downvotes: 31, replies: [] },
      { id: 'c6', text: 'Excellent connectivity to the stadium, very convenient during match days.', sentiment: 'Positive', importance: 'Low', upvotes: 42, downvotes: 2, replies: [] },
      { id: 'c8', text: 'The security staff were very helpful and guided me to the correct platform.', sentiment: 'Positive', importance: 'Low', upvotes: 35, downvotes: 0, replies: [] },
    ],
    analysis: {
      overallSentiment: 'Predominantly Positive',
      summary: 'Passengers appreciate the station\'s convenience and helpful staff, though improvements in the announcement system are required.',
    }
  },
  'aluva': {
    id: 'aluva',
    name: 'Aluva Station',
    comments: [
      { id: 'c11', text: 'Toilets are not clean. Needs immediate attention.', sentiment: 'Negative', importance: 'Critical', upvotes: 3, downvotes: 28, replies: [] },
      { id: 'c9', text: 'Parking facilities are inadequate. It\'s almost impossible to find a spot after 9 AM.', sentiment: 'Negative', importance: 'High', upvotes: 11, downvotes: 40, replies: [] },
      { id: 'c10', text: 'The station architecture is quite impressive.', sentiment: 'Positive', importance: 'Low', upvotes: 19, downvotes: 4, replies: [] },
      { id: 'c12', text: 'The frequency of trains to this station seems to have decreased recently.', sentiment: 'Neutral', importance: 'Medium', upvotes: 15, downvotes: 2, replies: [] },
    ],
    analysis: {
      overallSentiment: 'Predominantly Negative',
      summary: 'Critical feedback regarding essential amenities like sanitation and parking overshadows positive comments on aesthetics.',
    }
  },
};

export const getAllStations = (): Station[] => {
  return Object.values(stationData);
};

export const getStationById = (id: string): Station | undefined => {
  return stationData[id];
};