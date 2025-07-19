// AI integration utility for career roadmaps and resources
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize OpenRouter client if needed
const useOpenRouter = process.env.USE_OPENROUTER === 'true';
const openRouterApiKey = process.env.OPENROUTER_API_KEY;

/**
 * Generate career information using AI
 */
export async function generateCareerInfo(career, options = {}) {
  const { background = '', experience = '', education = '' } = options;
  
  const prompt = `
    Generate comprehensive career information for: ${career}
    
    ${background ? `User background: ${background}` : ''}
    ${experience ? `User experience: ${experience}` : ''}
    ${education ? `User education: ${education}` : ''}
    
    Please provide the following information in JSON format:
    1. A brief description of the career
    2. Required skills (technical and soft skills)
    3. Education requirements
    4. Career path progression (entry-level to senior positions)
    5. Estimated salary ranges by experience level
    6. Industry trends and outlook
    
    Format the response as a valid JSON object.
  `;

  try {
    if (useOpenRouter) {
      // Use OpenRouter API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterApiKey}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-4-turbo',
          messages: [
            { role: 'system', content: 'You are a career advisor expert. Provide accurate, detailed information about careers in JSON format.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } else {
      // Use OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'You are a career advisor expert. Provide accurate, detailed information about careers in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      });
      
      return JSON.parse(response.choices[0].message.content);
    }
  } catch (error) {
    console.error('Error generating career information:', error);
    throw error;
  }
}

/**
 * Generate a career roadmap using AI
 */
export async function generateCareerRoadmap(career, options = {}) {
  const { background = '', experience = '', education = '' } = options;
  
  const prompt = `
    Generate a detailed roadmap for becoming a successful ${career}.
    
    ${background ? `User background: ${background}` : ''}
    ${experience ? `User experience: ${experience}` : ''}
    ${education ? `User education: ${education}` : ''}
    
    Please provide the following information in JSON format:
    1. A structured learning path with clear milestones
    2. Recommended courses and resources for each milestone
    3. Estimated time to complete each milestone
    4. Skills to acquire at each stage
    5. Projects to build for portfolio
    6. Certification recommendations
    
    Format the response as a valid JSON object with the following structure:
    {
      "title": "Career Title",
      "description": "Brief overview",
      "estimatedDuration": "Total estimated time",
      "milestones": [
        {
          "title": "Milestone title",
          "description": "Description",
          "duration": "Estimated time",
          "skills": ["skill1", "skill2"],
          "resources": [
            { "title": "Resource title", "type": "course/book/etc", "link": "url", "description": "Brief description" }
          ],
          "projects": [
            { "title": "Project title", "description": "Brief description" }
          ],
          "certifications": [
            { "title": "Certification title", "provider": "Provider name", "link": "url" }
          ]
        }
      ]
    }
  `;

  try {
    if (useOpenRouter) {
      // Use OpenRouter API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterApiKey}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-4-turbo',
          messages: [
            { role: 'system', content: 'You are a career roadmap expert. Create detailed, structured learning paths for various careers.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } else {
      // Use OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'You are a career roadmap expert. Create detailed, structured learning paths for various careers.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      });
      
      return JSON.parse(response.choices[0].message.content);
    }
  } catch (error) {
    console.error('Error generating career roadmap:', error);
    throw error;
  }
}

/**
 * Search for careers based on user input using AI
 */
export async function searchCareers(query) {
  const prompt = `
    The user is looking for career suggestions based on this input: "${query}"
    
    Please provide a list of relevant career options that match their interests or skills.
    Format the response as a valid JSON array of objects with the following structure:
    [
      {
        "title": "Career Title",
        "description": "Brief description of the career",
        "matchReason": "Why this career matches the user's query",
        "category": "Technology/Healthcare/Business/etc"
      }
    ]
    
    Provide 5-10 relevant career suggestions.
  `;

  try {
    if (useOpenRouter) {
      // Use OpenRouter API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterApiKey}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-4-turbo',
          messages: [
            { role: 'system', content: 'You are a career advisor helping users find suitable career options based on their interests and skills.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } else {
      // Use OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'You are a career advisor helping users find suitable career options based on their interests and skills.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      });
      
      return JSON.parse(response.choices[0].message.content);
    }
  } catch (error) {
    console.error('Error searching careers:', error);
    throw error;
  }
}