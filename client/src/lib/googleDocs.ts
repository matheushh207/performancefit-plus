const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzXfuvq6-EuatzGnPgRZL1BcHsJwoegC8Jvmaxd4ixuhtn1jRZeqMTe11KQvsCbio1_bg/exec";

export interface Recipe {
  nome: string;
  dieta: string;
  calorias: number;
  proteina: number;
  carbs: number;
  gordura: number;
  preparo: number;
  tipo: string;
  ingredientes: string;
  modoPreparo: string;
}

export async function getAllRecipes( ): Promise<Recipe[]> {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getAllRecipes`);
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    return [];
  }
}

export async function getRecipesByDiet(diet: string): Promise<Recipe[]> {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getRecipesByDiet&diet=${encodeURIComponent(diet)}`);
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar receitas por dieta:", error);
    return [];
  }
}
