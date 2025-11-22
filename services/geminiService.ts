import { GoogleGenAI, Part } from "@google/genai";

const getAIClient = () => {
  // Always create a new instance to pick up the selected key
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false; // Fallback if not in correct environment, though environment usually guarantees it
};

export const requestApiKeySelection = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  }
};

// Use Gemini 2.5 Flash Image (Nano Banana) to modify the user's image
export const generateAnimalImage = async (base64Image: string, animal: string): Promise<string> => {
  const ai = getAIClient();
  
  // Remove data URL prefix if present for the API call
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `Transform the person in this image into a realistic, regular-sized ${animal}. The ${animal} should be in the same location, replacing the person, but keeping the exact same background and setting. Do not make the animal anthropomorphic. It should look like the person transformed into a real ${animal} in the same room.`
          }
        ],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/jpeg;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data returned from the model.");
  } catch (e: any) {
    console.error("Image generation error:", e);
    throw new Error(e.message || "Failed to generate image.");
  }
};

// Use Veo 3.1 to generate the transition video
export const generateTransitionVideo = async (startImage: string, endImage: string, animal: string): Promise<string> => {
  const ai = getAIClient();
  
  const cleanStart = startImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
  const cleanEnd = endImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A cinematic, smooth transformation video where a human morphs into a ${animal}. Show the person's body changing shape and size gradually to match the ${animal}. The clothes should appear to melt away or absorb into the animal's fur/skin. The transition should be visceral and detailed, showing the intermediate stages of the metamorphosis clearly, similar to an Animorphs transformation sequence.`,
      image: {
        imageBytes: cleanStart,
        mimeType: 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9', // Assuming camera capture is cropped/set to 16:9
        lastFrame: {
          imageBytes: cleanEnd,
          mimeType: 'image/jpeg',
        }
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("Video generation completed but no URI was returned.");
    }

    // Return the download link. The caller must append the API key when fetching/displaying if strict auth is needed,
    // but usually we fetch the blob to display it safely.
    return videoUri;

  } catch (e: any) {
    console.error("Video generation error:", e);
    throw new Error(e.message || "Failed to generate video.");
  }
};

export const fetchVideoBlob = async (uri: string): Promise<string> => {
    const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
    if (!response.ok) throw new Error("Failed to download video file.");
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}