import { GoogleGenAI, Type } from "@google/genai";
import { CardData, Reality, Stats, Deck } from "../types";
import { DECK_SIZE } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const choiceSchema = {
    type: Type.OBJECT,
    properties: {
        text: { type: Type.STRING, description: "Text for the choice. Keep it brief." },
        effects: {
            type: Type.OBJECT,
            properties: {
                Power: { type: Type.NUMBER, description: "Change in the 'Power' stat. Can be positive or negative." },
                Wealth: { type: Type.NUMBER, description: "Change in the 'Wealth' stat. Can be positive or negative." },
                People: { type: Type.NUMBER, description: "Change in the 'People' stat. Can be positive or negative." },
                Knowledge: { type: Type.NUMBER, description: "Change in the 'Knowledge' stat. Can be positive or negative." }
            },
            required: ["Power", "Wealth", "People", "Knowledge"]
        },
        nextCardIndex: {
            type: Type.NUMBER,
            description: "Optional. The 0-based index of the card to jump to. If omitted, it proceeds to the next card sequentially."
        },
        soundUrl: {
            type: Type.STRING,
            description: "Optional. A URL to a sound effect that fits the choice. If none, leave empty."
        }
    },
    required: ["text", "effects"]
};

const cardSchema = {
    type: Type.OBJECT,
    properties: {
        prompt: {
            type: Type.STRING,
            description: "The scenario text for the player. Should be a single, concise paragraph."
        },
        imageUrl: {
            type: Type.STRING,
            description: "Optional. A URL to an image that visually represents the scenario. Use generic, high-quality images from sources like Unsplash if possible. If no suitable image is found, leave this field empty."
        },
        leftChoice: choiceSchema,
        rightChoice: choiceSchema
    },
    required: ["prompt", "leftChoice", "rightChoice"]
};

const deckSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "A cool, thematic title for this deck/story." },
        description: { type: Type.STRING, description: "A brief, one-sentence synopsis of the story." },
        cards: {
            type: Type.ARRAY,
            items: cardSchema
        }
    },
    required: ["name", "description", "cards"]
};


export const generateInitialDeck = async (reality: Reality, currentStats: Stats): Promise<Deck> => {
    try {
        const statsSummary = Object.entries(currentStats).map(([key, value]) => `${reality.statNames[key as keyof Stats]}: ${value}`).join(', ');

        const prompt = `
        The player is starting a new game with this situation: ${statsSummary}.
        Generate a full, unique, and challenging deck of ${DECK_SIZE} scenario cards for the game.
        The choices should have plausible but non-obvious consequences.
        Stat changes should generally be between -35 and +35.
        Ensure the prompts are engaging, varied, and fit the ${reality.name} theme. Do not repeat scenarios within the deck.
        Give the deck a cool, thematic name and a one-sentence synopsis.
        Optionally create branching narratives by setting the 'nextCardIndex' property on choices to jump to other cards. If you create branches, ensure they create an interesting, potentially looping story. The final card in the deck is the win condition.
        The Power stat is named ${reality.statNames.Power}.
        The Wealth stat is named ${reality.statNames.Wealth}.
        The People stat is named ${reality.statNames.People}.
        The Knowledge stat is named ${reality.statNames.Knowledge}.
        Optionally, you can provide an image URL for each card that fits the scenario.
        Optionally, you can provide a sound effect URL for each choice.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: reality.systemInstruction,
                responseMimeType: "application/json",
                responseSchema: deckSchema,
                temperature: 1.0,
            },
        });

        const deckJson = JSON.parse(response.text);
        return deckJson as Deck;

    } catch (error) {
        console.error("Error generating deck:", error);
        // Fallback deck in case of API error
        return {
            name: "Fallback Protocol",
            description: "A connection to the multiverse was lost.",
            cards: [{
                prompt: "A cosmic anomaly disrupts your connection to the multiverse. The path forward is hazy, but you must choose.",
                leftChoice: { text: "Reboot", effects: { Power: 5, Wealth: -5, People: 0, Knowledge: 0 } },
                rightChoice: { text: "Wait", effects: { Power: -5, Wealth: 5, People: 0, Knowledge: 0 } },
            }]
        };
    }
};

export const generateBranchingDeckFromPrompt = async (reality: Reality, storyPrompt: string): Promise<Deck> => {
    try {
        const prompt = `
        A story creator wants a deck of ${DECK_SIZE} cards for the game based on this high-level prompt: "${storyPrompt}".
        Generate a full, unique, and challenging deck of ${DECK_SIZE} scenario cards that follows the creator's prompt.
        Give the generated deck a cool, thematic name based on the prompt, and use the prompt itself as the deck's description.
        Create a branching narrative using the 'nextCardIndex' property on choices to make the story interactive and replayable. Make sure jumps are valid (within the 0 to ${DECK_SIZE - 1} range). The final card in the array (index ${DECK_SIZE - 1}) should be the 'win' or final ending card.
        The choices should have plausible but non-obvious consequences.
        Stat changes should generally be between -35 and +35.
        Ensure the prompts are engaging, varied, and fit the ${reality.name} theme.
        The Power stat is named ${reality.statNames.Power}.
        The Wealth stat is named ${reality.statNames.Wealth}.
        The People stat is named ${reality.statNames.People}.
        The Knowledge stat is named ${reality.statNames.Knowledge}.
        Optionally, you can provide an image URL for each card that fits the scenario.
        Optionally, you can provide a sound effect URL for each choice.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: reality.systemInstruction,
                responseMimeType: "application/json",
                responseSchema: deckSchema,
                temperature: 0.9,
            },
        });

        const deckJson = JSON.parse(response.text);
        return deckJson as Deck;

    } catch (error) {
        console.error("Error generating branching deck:", error);
        throw new Error("The AI Story Director failed to generate a deck. Please check the connection or try a different prompt.");
    }
};