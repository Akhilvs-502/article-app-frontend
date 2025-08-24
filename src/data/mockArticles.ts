import { Article } from '@/types/article';

export const mockArticles: Article[] = [
  {
    id: 1,
    title: 'Latest Developments in Space Exploration',
    category: 'Space',
    author: 'John Doe',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d0bd843ac?w=800&h=400&fit=crop',
    content: 'Space exploration has seen remarkable advancements in recent years. From private companies launching missions to Mars to new discoveries about exoplanets, the field is expanding rapidly. NASA\'s Artemis program aims to return humans to the Moon, while SpaceX continues to push boundaries with reusable rockets.\n\nPrivate space companies like Blue Origin and Virgin Galactic are making space tourism a reality, while international collaborations are expanding our understanding of the cosmos. The James Webb Space Telescope has already provided unprecedented views of distant galaxies, revealing secrets about the early universe.\n\nMars missions continue to capture public imagination, with Perseverance rover making groundbreaking discoveries about the Red Planet\'s geological history. Meanwhile, plans for crewed missions to Mars are becoming more concrete, with timelines extending into the 2030s.\n\nThe future of space exploration looks brighter than ever, with new technologies enabling more ambitious missions and discoveries that could fundamentally change our understanding of the universe and our place within it.',
    likes: 45,
    dislikes: 3,
    isLiked: false,
    isDisliked: false
  },
  {
    id: 2,
    title: 'The Future of Renewable Energy',
    category: 'Science',
    author: 'Jane Smith',
    date: '2024-01-14',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop',
    content: 'Renewable energy sources are becoming increasingly cost-effective and efficient. Solar panels have seen dramatic improvements in efficiency, while wind energy continues to grow. Battery storage technology is advancing rapidly, making renewable energy more reliable than ever before.\n\nSolar energy has become the cheapest form of electricity in many parts of the world, with costs continuing to decline. New technologies like perovskite solar cells promise even higher efficiencies and lower costs. Wind energy is also seeing significant improvements, with larger turbines and better materials leading to increased energy capture.\n\nEnergy storage is the key to making renewables truly competitive. Lithium-ion batteries are getting cheaper and more efficient, while new technologies like flow batteries and compressed air storage offer alternatives for grid-scale storage. The development of smart grids is also crucial, allowing for better integration of renewable sources.\n\nAs we move towards a carbon-neutral future, renewable energy will play an increasingly central role. The transition is not just about reducing emissions, but also about creating a more resilient and decentralized energy system.',
    likes: 128,
    dislikes: 12,
    isLiked: true,
    isDisliked: false
  },
  {
    id: 3,
    title: 'AI in Modern Healthcare',
    category: 'Technology',
    author: 'John Doe',
    date: '2024-01-13',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    content: 'Artificial Intelligence is revolutionizing healthcare in unprecedented ways. From diagnostic tools that can detect diseases earlier than human doctors to robotic surgery systems that improve precision, AI is enhancing patient outcomes and reducing medical errors.\n\nMachine learning algorithms are being trained on vast datasets of medical images, enabling earlier detection of conditions like cancer, heart disease, and neurological disorders. These AI systems can often spot patterns that human radiologists might miss, leading to earlier intervention and better outcomes.\n\nRobotic surgery systems, guided by AI, are providing surgeons with enhanced precision and control. These systems can perform complex procedures with minimal invasiveness, reducing recovery times and complications. AI is also being used to optimize treatment plans, analyzing patient data to recommend the most effective therapies.\n\nThe future of AI in healthcare is incredibly promising, with potential applications ranging from drug discovery to personalized medicine. However, it\'s important to ensure that these technologies are developed and deployed responsibly, with proper oversight and validation.',
    likes: 89,
    dislikes: 7,
    isLiked: false,
    isDisliked: false
  },
  {
    id: 4,
    title: 'The Evolution of Football Tactics',
    category: 'Sports',
    author: 'Mike Johnson',
    date: '2024-01-12',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    content: 'Modern football has evolved significantly from traditional formations. Teams now use data analytics to optimize player positioning, pressing strategies, and possession-based play. The role of full-backs has transformed, and pressing systems have become more sophisticated.\n\nData analytics has revolutionized how teams approach the game. Coaches now have access to detailed statistics about player performance, team patterns, and opposition analysis. This has led to more strategic approaches to the game, with teams adapting their tactics based on data-driven insights.\n\nThe pressing game has become more intelligent and coordinated. Teams now press in specific zones rather than chasing the ball everywhere, conserving energy while maintaining pressure. This requires excellent communication and understanding between players.\n\nPossession-based football has also evolved, with teams using possession not just to control the game, but to create specific attacking opportunities. The role of the goalkeeper has expanded beyond shot-stopping to include distribution and initiating attacks.',
    likes: 67,
    dislikes: 15,
    isLiked: false,
    isDisliked: false
  },
  {
    id: 5,
    title: 'Breakthrough in Quantum Computing',
    category: 'Technology',
    author: 'Sarah Chen',
    date: '2024-01-11',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
    content: 'Researchers have achieved a major milestone in quantum computing with the development of error-corrected qubits. This breakthrough brings us closer to practical quantum computers that can solve complex problems beyond the reach of classical computers.\n\nQuantum error correction is essential for building reliable quantum computers. Qubits are extremely fragile and can lose their quantum state due to environmental noise. Error correction codes can detect and fix these errors, making quantum computations more reliable.\n\nThe new error-corrected qubits use a technique called surface codes, which arrange qubits in a two-dimensional grid. This approach allows for better error detection and correction, significantly improving the reliability of quantum computations.\n\nThis breakthrough has implications for fields ranging from cryptography to drug discovery. Quantum computers could potentially break current encryption methods, but they could also simulate complex molecular interactions for drug development. The race is now on to scale up these error-corrected systems to practical sizes.',
    likes: 234,
    dislikes: 8,
    isLiked: false,
    isDisliked: false
  },
  {
    id: 6,
    title: 'Climate Change: Global Impact Assessment',
    category: 'Environment',
    author: 'Dr. Emily Brown',
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
    content: 'Recent studies show accelerating climate change impacts across all continents. Rising sea levels, extreme weather events, and ecosystem disruptions are occurring faster than predicted. However, there are signs of hope as renewable energy adoption accelerates globally.\n\nThe impacts of climate change are becoming increasingly visible and severe. Sea levels are rising faster than previously estimated, threatening coastal communities worldwide. Extreme weather events like hurricanes, droughts, and heatwaves are becoming more frequent and intense.\n\nEcosystems are also feeling the pressure, with many species struggling to adapt to rapidly changing conditions. Coral reefs are bleaching at unprecedented rates, while forests are experiencing more frequent and severe wildfires.\n\nDespite these challenges, there are positive developments. Renewable energy costs have fallen dramatically, making clean energy more accessible than ever. Many countries are setting ambitious targets for carbon neutrality, and public awareness of climate issues is growing. The challenge now is to accelerate these positive trends while building resilience to the changes that are already inevitable.',
    likes: 156,
    dislikes: 23,
    isLiked: false,
    isDisliked: false
  }
]; 