
import {ingredientsData} from './cookingdata.js'

export function getIngredientObjByName(itemName){
    return ingredientsData.find(item => {
        if (item.name === itemName){
            return item
        }
    })
}

export function getMethodByName(itemName){
    const itemObj = ingredientsData.find(item => {
        return item.name === itemName
    })

    if (itemObj){
        return itemObj.method
    }
    else{
        return ""
    }
}

export function getMethodbyCookingRank(cookingRank)
{
    switch (cookingRank){
        case "Rank Novice":
            return "Mix";
        case "Rank F":
            return "Bake";
        case "Rank E":
            return "Simmer";
        case "Rank D":
            return "Knead";
        case "Rank C":
            return "Boil";
        case "Rank B":
            return "Noodle";
        case "Rank A":
            return "Deep-fry";
        case "Rank 9":
            return "Stir-fry";
        case "Rank 8":
            return "Pasta Making";
        case "Rank 7":
            return "Jam Making";
        case "Rank 6":
            return "Pie Making";
        case "Rank 5":
            return "Steaming";
        case "Rank 4":
            return "Pizza Making";
        case "Rank 3":
            return "Fermenting";
        case "Rank 2":
            return "Sous Vide";
        case "Rank 1":
            return "Julienning";
        default:
            return "Unknown";
    }
}

export function getCookingRankByMethod(methodName)
{
    switch (methodName){
        case "Mix":
            return "Rank Novice";
        case "Bake":
            return "Rank F";
        case "Simmer":
            return "Rank E";
        case "Knead":
            return "Rank D";
        case "Boil":
            return "Rank C";
        case "Noodle Making":
            return "Rank B";
        case "Deep-fry":
            return "Rank A";
        case "Stir-fry":
            return "Rank 9";
        case "Pasta Making":
            return "Rank 8";
        case "Jam Making":
            return "Rank 7";
        case "Pie Making":
            return "Rank 6";
        case "Steaming":
            return "Rank 5";
        case "Pizza Making":
            return "Rank 4";
        case "Fermenting":
            return "Rank 3";
        case "Sous Vide":
            return "Rank 2";
        case "Julienning":
            return "Rank 1";
        default:
            return "Unknown";
    }
}

function getRankingByCookingRankName(rankName){
    
    const rankOrder = {
        "Unlearned": 0,
        "Rank Novice": 1,
        "Rank F": 2,
        "Rank E": 3,
        "Rank D": 4,
        "Rank C": 5,
        "Rank B": 6,
        "Rank A": 7,
        "Rank 9": 8,
        "Rank 8": 9,
        "Rank 7": 10,
        "Rank 6": 11,
        "Rank 5": 12,
        "Rank 4": 13,
        "Rank 3": 14,
        "Rank 2": 15,
        "Rank 1": 16,
        "Dan 1": 17,
        "Dan 2": 18,
        "Dan 3": 19,
    }

    const value = rankOrder[rankName] || 0

    return value
}

function compareRankHighest(rank1, rank2)
{
    const value1 = getRankingByCookingRankName(rank1)
    const value2 = getRankingByCookingRankName(rank2)

    if (value1 >= value2)
    {
        return rank1
    }
    if (value2 > value1)
    {
        return rank2
    }
    return "uh oh"
}

function isIngredientRankHigherThanMainDish(mainRank, ingredientRank)
{
    const mainValue = getRankingByCookingRankName(mainRank)
    const ingredientValue = getRankingByCookingRankName(ingredientRank)

    return ingredientValue > mainValue
}

// Returns the minimum rank required to cook all ingredients
// Thhihs code is going to need a refactor to work with selected recipetree
function getRequiredCookingRankAll(itemObj)
{
    if (!itemObj) return "Rank Novice";

    const currentRank = getCookingRankByMethod(itemObj.method)

    //  Maybe add an ignore statement for objects that are purchaseable
    if (itemObj?.purchase)
    {
        console.log(`skipping ${itemObj.name} due to being purchaseable`)
        return "Rank Novice"
    }

    let highestNestedRank = "Rank Novice"

    //  If there are ingredients
    if (Array.isArray(itemObj.ingredients))
    {
        for (const ingredient of itemObj.ingredients){
            const ingredientObj = ingredientsData.find(function(item){
                return item.name === ingredient
            })

            const nestedRank = getRequiredCookingRankAll(ingredientObj)

            highestNestedRank = compareRankHighest(highestNestedRank, nestedRank)
        }
    }

    return compareRankHighest(currentRank, highestNestedRank)
}