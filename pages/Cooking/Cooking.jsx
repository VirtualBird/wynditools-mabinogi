import {ingredientsData} from './cookingdata.js'
import {
    getCookingRankByMethod,
    getIngredientObjByName,
    getMethodByName
        } from './cookingUtils.js'

import SearchList from './components/SearchList.jsx'
import ClickableItemText from './components/ClickableItemText.jsx'

import './Cooking.css'

import React, { useState } from "react"

export default function Cooking(){

    const [byNameIsChecked, setByNameIsChecked] = React.useState(true)
    const [byIngredientIsChecked, setByIngredientIsChecked] = React.useState(false)

    const [itemSearch, setItemSearch] = React.useState("")
    const [searchIsFocused, setSearchFocused] = useState(false)

    const [mainItem, setMainItem] = React.useState(null)
    const [recipeTree, setRecipeTree] = React.useState()
    const [selectedItemName, setSelectedItemName] = React.useState(null)
    const [referToRecipes, setReferToRecipes] = React.useState({})


    React.useEffect(() => {
        function handleClick(event){
            //  If user clicked on item in ItemSearch List
            if (event.target.classList.contains('cooking-item-search-name')){
                console.log("Clicked item in list")
                handleItemSearchClick(event.target.dataset.name)
            }
            else if (event.target.dataset.name){
                console.log(event.target.dataset.name, "was Clicked")
                // Do logic for displaying/setting selected item
                setSelectedItemName(event.target.dataset.name)
            }
            // If user clicked on span to change recipe
            else if (event.target.dataset.referName && event.target.dataset.referRecipe){
                const itemReferName = event.target.dataset.referName
                const itemReferRecipe = event.target.dataset.referRecipe

                console.log(itemReferName, itemReferRecipe, "clicked")
                addReferToRecipes(itemReferName, itemReferRecipe)
            }

            console.log(event.target)
        }
        document.addEventListener('mousedown', handleClick)
        //  useEffect cleanup function
        return () => {
            console.log("Cleaning up click EventListener...")
            document.removeEventListener('mousedown', handleClick)
        }
    }, [])

    React.useEffect(() => {
        console.log("referToRecipes changed: ", referToRecipes)
    }, [referToRecipes])

    // Update Recipe Tree when main item changes or refer to recipes changes
    React.useEffect(() => {
        if (!mainItem) return

        setRecipeTree(getRecipeTree(mainItem))
    },[mainItem, referToRecipes])

    function handleItemSearchClick(itemName){
        const itemObj = getIngredientObjByName(itemName)
        setMainItem(itemObj)
        // Perhaps clear selected item when you click an item to avoid confusion
        setSelectedItemName(null)
    }

    function addReferToRecipes(itemName, recipe){
        console.log("adding", itemName, recipe);
        setReferToRecipes(prev => ({...prev, [itemName]: recipe}) )
    }

    function getReferToRecipeByName(itemName){
        // obj lookup recipe of itemName if it exists, default to recipe1 if doesn't exist
        const referRecipe = referToRecipes?.[itemName] ?? "recipe1"
        
        if (referRecipe){
            return referRecipe
        }

        return "recipe1"
    }

    //  This runs in useEffect whenever anything in recipeTree or referToRecipes changes
    function getRecipeTree(itemObj, selected = "recipe1"){
        const recipe = {}
        const selectedRecipe = getReferToRecipeByName(itemObj.name)
        console.log(selectedRecipe)
        // If Recipe property exists
        if (itemObj?.recipe){
            // Check for instances of other recipes
            let recipeCounter = 0
            recipe["name"] = itemObj.name
            recipe["selected"] = selectedRecipe

            if (recipe["selected"] == "purchase"){
                console.log(itemObj.name, "is purchaseable")
            }

            if (itemObj.recipe.recipe1){
                recipe["recipe1"] = true
                recipeCounter ++
            }
            if (itemObj.recipe.recipe2){
                recipe["recipe2"] = true
                recipeCounter ++
            }
            if (itemObj.recipe.recipe3){
                recipe["recipe3"] = true
                recipeCounter ++
            }
            if (itemObj.recipe.recipe4){
                recipe["recipe4"] = true
                recipeCounter ++
            }
            if (itemObj.recipe.ingame){
                recipe["ingame"] = true
                recipeCounter ++
            }
            recipe["hasMultiple"] = recipeCounter > 1 ? true: false
            recipe["nested"] = []

            // console.log(itemObj.recipe[selected])

            if (itemObj.recipe[selectedRecipe]){
                for (const ingredient of itemObj.recipe[selectedRecipe]){
                    // console.log("this ingredient", ingredient)
                    const ingrObj = ingredientsData.find(item => {
                        return item.name === ingredient.name
                    })

                    // console.log("Found Item", ingredient.name, ingrObj, )

                    //  If this item has recipe property
                    if (ingrObj && 'recipe' in ingrObj){
                        //I need to add a property of that nested uhh I'll use an obj
                        const nestedRecipe = getRecipeTree(ingrObj)
                        recipe["nested"].push(nestedRecipe)
                    }
                    else if(ingrObj){
                        const nestedRecipe = getRecipeTree(ingrObj)
                        recipe["nested"].push(nestedRecipe)
                    }
                    else // if ingrObj doesn't exist and all we have is a name
                    {
                        //  Just push the ingredient's name into the array
                        const nestedRecipe = getRecipeTree(ingredient.name)
                        recipe["nested"].push(nestedRecipe)
                    }
                }
            }            
            // console.log("Full Recipe Tree", recipe)
            return recipe
        }
        //  If a string was passed as itemObj, that means the ingredient we searched for doesn't exist in the cookingdata.js file
        else if(typeof itemObj === "string")
        {
            console.warn("Could not find ITEM in data: ", itemObj)
            recipe["name"] = itemObj
            recipe["hasMultiple"] = false
            return recipe
        }
        // If object doesn't have recipe property
        else{
            // You know techinically this shouldn't run unless there's some crazy script manipulation happening...?
            recipe["name"] = itemObj?.name ? itemObj.name : "UNDEFINED ITEM"
            recipe["hasMultiple"] = false
            return recipe
        }
    }

    function handleOnChange(){
        setByNameIsChecked(prev => !prev)
    }

    function handleOnChangeByIngredient(){
        setByIngredientIsChecked(prev => !prev)
    }

    function handleSearchInput(value){
        setItemSearch(value)
    }

    //  This is the main dish selected
    function renderMainDish(item){
        if (item){

            let itemCurrency = item?.priceCurrency ? ` ${item?.priceCurrency}` : "g"

            const hasMultipleRecipes = Object.keys(item.recipe ?? {}).length > 1 ? true : false
            const hasRecipeAndPrice = null
            const referRecipe = getReferToRecipeByName(item.name)

            return <div className="cooking-main-item-content">
                <h2>Main Item</h2>
                {item.name ? <h3>{item.name}</h3> : <h2>Undefined Item Name</h2>}
                {item.method ? <p>{`${item.method} (${getCookingRankByMethod(item.method)} Cooking)`}</p> : null}

                {hasMultipleRecipes ? <p>This item has multiple known recipes</p> : null}
                {hasMultipleRecipes ? <p className='cooking-main-item-recipes'>
                    {item.recipe?.ingame ? <span className={referRecipe === "ingame" ? "selected" : ""} onClick={() => addReferToRecipes(item.name, "ingame")}>In-game</span> : null}
                    {item.recipe?.recipe1 ? <span className={referRecipe === "recipe1" ? "selected" : ""} onClick={() => addReferToRecipes(item.name, "recipe1")}>1</span> : null}
                    {item.recipe?.recipe2 ? <span className={referRecipe === "recipe2" ? "selected" : ""} onClick={() => addReferToRecipes(item.name, "recipe2")}>2</span> : null}
                    {item.recipe?.recipe3 ? <span className={referRecipe === "recipe3" ? "selected" : ""} onClick={() => addReferToRecipes(item.name, "recipe3")}>3</span> : null}
                    {item.recipe?.recipe4 ? <span className={referRecipe === "recipe4" ? "selected" : ""} onClick={() => addReferToRecipes(item.name, "recipe4")}>4</span> : null}
                    {item?.purchase ?  <span className={referRecipe === "purchase" ? "selected" : ""} data-refer-name={item.name} data-refer-recipe="purchase">Purchase</span> : null}

                    </p> : null}

                {item.recipe ? renderMainRecipe(): null}

                {/* Display Materials list if available */}
                {item?.materials && <ul>{item.materials.map(material => <li>{material?.quantity}x {material?.name}</li>)}</ul>}

                {/* Display NPC Purchase location and price if available */}
                {item.purchase ?? '' ? <p>Purchase from: {item.purchase.join(", ")} ({item.price ?? '-PRICE UNKNOWN-'}{itemCurrency})</p> : null}

                {/* Display Fishing if available */}
                {item?.fishing && <p>Fishing: {item.fishing.map(location => location).join(', ')}</p>}

                {/* Display Gathering method if available */}
                {item?.gathering && <p>Gathering: {item.gathering}</p>}
                
                {/* Display Location if available */}
                {item?.location && <p>Location: {item.location}</p>}

                {/* Display drop locationo if available*/}
                {item?.drop ? Array.isArray(item.drop) ?<><p>Drop:</p> <ul>{item.drop.map(drop => <li><p>{drop}</p></li>)}</ul></> : <p>Drop: {item.drop}</p> : null}
            
                {/* Display Ingredient Hunting if available */}
                {item?.ingredientHunting && <p>Drops from the Ingredient Hunting Skill</p>}

                {/* Display PartTime Jof if avaialbe */}
                {item?.partTimeJob && <p>Part-time Job: {item.partTimeJob} ({item?.partTimeJobPT} Pts)</p>}
            </div>
        }
        else{
            return null
        }
    }

        // Render sub ingredient details
    function renderSelectedItem(){
        const itemName = selectedItemName
        const itemObj = getIngredientObjByName(itemName)
        const referRecipe = getReferToRecipeByName(itemName)

        if (itemName && !itemObj){
            return <div className="cooking-selected-item-wrapper">Error: {itemName} is missing from database.</div>
        }
        else if(!itemObj){
            return <></>
        }

        const itemMethod = itemObj?.method ?? ''
        const itemHasRecipes = hasRecipes(itemObj)
        const itemHasMultipleRecipes = hasMultipleRecipes(itemObj)
        const isPurchaseable = itemObj?.purchase ? true : false

        const hasRecipeAndPurchaseable = itemHasRecipes >= 1 && isPurchaseable
        const showMultipleRecipes = itemHasRecipes > 1 || (itemHasRecipes >= 1 && isPurchaseable)

        console.log("selected Item",itemObj)
        // Maybe don't return anything if there is no selectedItem
        return (
            <div className="cooking-selected-item-wrapper">
                <h3>Ingredient Details</h3>
                {itemName && <>
                    <h3>{itemName}</h3>
                    {itemMethod && <p>Method: {itemMethod} ({getCookingRankByMethod(itemMethod)})</p>}
                    {showMultipleRecipes && <p>Item has multiple recipes.</p>}
                    {showMultipleRecipes && <p className='cooking-selected-item-recipes'>
                        {itemObj.recipe?.ingame ? <span className={referRecipe === "ingame" ? "selected" : ""} data-refer-name={itemName} data-refer-recipe="ingame">In-game</span> : null}
                        {itemObj.recipe?.recipe1 ? <span className={referRecipe === "recipe1" ? "selected" : ""} data-refer-name={itemName} data-refer-recipe="recipe1">1</span> : null}
                        {itemObj.recipe?.recipe2 ? <span className={referRecipe === "recipe2" ? "selected" : ""} data-refer-name={itemName} data-refer-recipe="recipe2">2</span> : null}
                        {itemObj.recipe?.recipe3 ? <span className={referRecipe === "recipe3" ? "selected" : ""} data-refer-name={itemName} data-refer-recipe="recipe3">3</span> : null}
                        {itemObj.recipe?.recipe4 ? <span className={referRecipe === "recipe4" ? "selected" : ""} data-refer-name={itemName} data-refer-recipe="recipe4">4</span> : null}
                        {itemObj?.purchase ?  <span className={referRecipe === "purchase" ? "selected" : ""} data-refer-name={itemName} data-refer-recipe="purchase">Purchase</span> : null}
                    </p>
                    }

                    {/* For now just use recipe 1 I guess */}
                    {<p>
                        {itemObj.recipe?.[referRecipe]?.map((ingredient) => {
                        return (`${ingredient?.name} (${ingredient?.percent}%)`)
                    }).join(', ')}</p>}

                    {/* Display Materials list if available */}
                    {itemObj?.materials && <ul>{itemObj.materials.map(material => <li>{material?.quantity}x {material?.name}</li>)}</ul>}

                    {/* Display Fishing if available */}
                    {itemObj?.fishing && <p>Fishing: {itemObj.fishing.map(location => location).join(', ')}</p>}

                    {/* Display Price if available */}
                    {itemObj?.price && <p>Price: {itemObj.price} {itemObj?.priceCurrency ? " "+itemObj.priceCurrency : "g"}</p>}

                    {/* Display NPCs to purchase from if available */}
                    {itemObj?.purchase && <p>Purchase: {itemObj.purchase.map(npc => npc).join(', ')}</p>}

                    {/* Display Gathering method if available */}
                    {itemObj?.gathering && <p>Gathering: {itemObj.gathering}</p>}
                    
                    {/* Display drop locationo if available*/}
                    {itemObj?.drop ? Array.isArray(itemObj.drop) ?<><p>Drop:</p> <ul>{itemObj.drop.map(drop => <li><p>{drop}</p></li>)}</ul></> : <p>Drop: {itemObj.drop}</p> : null}

                    {/* Display Ingredient Hunting if available */}
                    {itemObj?.ingredientHunting && <p>Drops from the Ingredient Hunting Skill</p>}

                    {/* Display PartTime Jof if avaialbe */}
                    {itemObj?.partTimeJob && <p>Part-time Job: {itemObj.partTimeJob} ({itemObj?.partTimeJobPT} Pts)</p>}
                </>} 
            </div>
        )
    }

    function hasRecipes(itemObj){
        return Object.keys(itemObj?.recipe ?? {} ).length
    }

    function hasMultipleRecipes(itemObj){
        return Object.keys(itemObj?.recipe ?? {} ).length > 1 ? true : false
    }


    function renderMainRecipe()
    {
        if (mainItem && recipeTree){
            //Uhh so I need to get the recipe tree
            const referRecipe = getReferToRecipeByName(mainItem.name)
            const items = mainItem.recipe[referRecipe]
            // console.log("Render this", items)
            // Might be possible for something to break here if the item returned has no name/percent
            return <div>
                {referRecipe !== "purchase" && <>
                <p>Main Ingredients</p>
                <ul>
                    {items.map(item => <li>{<ClickableItemText>{item.name}</ClickableItemText>} ({item.percent}%)</li>)}
                </ul></>}
            </div>
        }
        return <></>
    }

    //  I guess I might need somekind of fancy state handling thing?
    function getIngredientTree(itemObj){
        console.log(itemObj)
    }

    //  Deprecated function was using to rearrange my ingredients data
    function reformatData(){
        return ingredientsData.map(item => {

            const recipeProperty = {}
            let changingRecipe = false
            //if recipe value exists
            if (item?.recipe){
                //check if the recipe value is an array
                changingRecipe = true
                if (Array.isArray(item.recipe))
                {
                    // I need to store it as another way
                    recipeProperty["recipe1"] = item.recipe
                }
            }
            if (item?.recipe2){
                if (Array.isArray(item.recipe2))
                {
                    recipeProperty["recipe2"] = item.recipe2
                }
            }
            if (item?.recipe3){
                if (Array.isArray(item.recipe3))
                {
                    recipeProperty["recipe3"] = item.recipe3
                }
            }
            if (item?.recipe4){
                if (Array.isArray(item.recipe4))
                {
                    recipeProperty["recipe4"] = item.recipe4
                }
            }
            
            if (item?.recipeInGame){
                if (Array.isArray(item.recipeInGame))
                {
                    recipeProperty["ingame"] = item.recipeInGame
                }
            }

            if (changingRecipe){
                const {recipeInGame, recipe2, recipe3, recipe4, ...itemWithoutOldRecipes} = item
                const newItem = {...itemWithoutOldRecipes, recipe: recipeProperty}
                return newItem
            }
            else
            {
                return item
            }
        })
    }

    function renderIngredientTree(recipeTree){
        // console.log(recipeTree)
        if (recipeTree)
        {
            // if going through a nested loop/property
            if (Array.isArray(recipeTree))
            {
                // console.log("This is an array ",recipeTree)
                // let displayElement = ""
                // //I suppose go through the loop
                // for(let item of recipeTree ){
                //     displayElement += <h2>{recipeTree.name}</h2>
                // }
                // console.log(displayElement)



                return <ul className="recipe-tree-list">{recipeTree.map(item => (
                    <li>
                        <span className='method'>{getReferToRecipeByName(item.name) === "purchase" ? "Purchase" : getMethodByName(item.name)}</span>
                        <p className='recipe-tree-item-name'><ClickableItemText>{item.name}</ClickableItemText></p>
                        {renderIngredientTree(item.nested)}
                    </li>
                ))}</ul>
            }
            else
            {
                return <div className='recipe-tree'>
                    <h2 className="recipe-tree-title">Recipe Tree</h2>
                    <span>{getIngredientObjByName(recipeTree?.name)?.method}</span>
                    {recipeTree?.name ? <h3 className="recipe-tree-main-item">{recipeTree.name}</h3>: null}
                    {recipeTree?.nested ? <ul className="recipe-tree-main-list">{renderIngredientTree(recipeTree.nested)}</ul> : <div>{recipeTree.name}</div>}
                </div>
            }

        }
        else{
            return <></>
        }
    }

    // erm, maybe I should get recipe tree instead?
    function getBaseIngredientsFromRecipeTree(recipeTree){
        const ingredientsArr = []
        // console.log("Starting Base Function ", recipeTree)

        if (recipeTree)
        {
            // console.log("exists")
            //  If going through an array, that means we are going through a nested property
            if (Array.isArray(recipeTree)){
                // console.log("F1 Going through nested property", recipeTree)

                //  Go through array and flatten
                const something1 = recipeTree.map(item => {
                    // console.log("mapping" ,item)
                    return getBaseIngredientsFromRecipeTree(item)
                }).flat()

                // console.log("F1 Result from nested property", something1)

                //push it all to ingredients arr
                ingredientsArr.push(...something1)
            }
            //  If a nested property exists in Recipe Tree
            else if (recipeTree.nested){
                // console.warn(recipeTree.selected, recipeTree)

                const userSelectedPurchaseable = getReferToRecipeByName(recipeTree.name) === "purchase"

                //  If the property was selected to be purchaseable
                if (userSelectedPurchaseable){
                    // Push the item directly
                    ingredientsArr.push(recipeTree.name)
                }
                // If we're just cooking the item
                else{
                    // console.log("F2 Nested property exists")
                    // console.log("Checking Nested Property")
                    //  recursively go through that nested property
                    const something2 = getBaseIngredientsFromRecipeTree(recipeTree.nested)
                    // console.log("F2 something2", something2)
                    //push it all to ingredients arr
                    ingredientsArr.push(...something2)
                }

                
            }
            else{
            //  If none of above then we're returning the base ingredient's name
                // console.log("F3 Base Ingredient", recipeTree)
                ingredientsArr.push(recipeTree.name)
            }
        }

        // console.log("Returning Base Ingredients: ",ingredientsArr)
        return ingredientsArr
    }

    //Literally do a full search through cookingData for missing ingredients
    // I should probably put this function somewhere else its just a testing function
    function deepDiveCheckMissingIngredients(){
        const totalItems = ingredientsData.reduce((acc, curr) => {
            const items = []
                items.push(...curr?.recipe?.ingame?.map(item => item.name) ?? [])
                items.push(...curr?.recipe?.recipe1?.map(item => item.name)?? [])
                items.push(...curr?.recipe?.recipe2?.map(item => item.name)?? [])
                items.push(...curr?.recipe?.recipe3?.map(item => item.name)?? [])
                items.push(...curr?.recipe?.recipe4?.map(item => item.name)?? [])
            
            acc.push(...items)
            return acc
        } , [])

        const reducedItems = totalItems.reduce((acc, curr) => {
            const ingredientKey = acc.find(item => item === curr)

            if (ingredientKey){
                // egg do nothing
            }
            else{   
                //  NOTE: Maybe be careful with push(curr) its technically pushing by reference and not by value
                acc.push(curr)
            }

            return acc
        }, [])

        reducedItems.forEach(item => {
            if (!ingredientsData.some(ingitem => ingitem.name === item)){
                
                console.warn(item, " is Missing")
                
                return
            }
        })

        return reducedItems
    }
    // uncomment this if I need to check ingredients for all items existing in database
    // console.log(deepDiveCheckMissingIngredients())



    // And then heres a function for turning the baseIngredients list into a counted list as an object
    function countBaseIngredients(ingredientsArr){
        const baseIngredientsObj = {}

        for (let ingredient of ingredientsArr){
            if (baseIngredientsObj.hasOwnProperty(ingredient)){
                baseIngredientsObj[ingredient] += 1
            }
            else{
                baseIngredientsObj[ingredient] = 1
            }
        }

        return baseIngredientsObj
    }

    function renderBaseIngredients(baseIngObj){
        const elements = []

        for (const item in baseIngObj){
            const quantity = baseIngObj[item]
            elements.push(<li>{`${quantity}x `}<ClickableItemText>{item}</ClickableItemText></li>)
        }
        
        const finalElement = <div className='cooking-base-ingredients'>
            <h2>Base Ingredients</h2>
            <ul>{elements}</ul></div>

        return finalElement
    }

    //  Go through an object's recipe tree and return an array of objects to use later
    function instructionsArr(recipeTree, currentDepth = 0){
        const instructions = []
        // console.log("depth:", currentDepth, "Calling instructionsArr", recipeTree)

        //  If looking through a Recipe Tree
        if (recipeTree)
        {
            //  If looking through an array of items
            if (Array.isArray(recipeTree)){

                const itemObj = recipeTree.map(item => {
                    // console.log("itemObj", item)

                    //  I need to be able to tell the difference between a recipeTree.nested and an instructionsArr
                    if (Object.hasOwn(item, "hasMultiple")){
                        // console.log("recipeTree.nested", item)
                        if (item.nested){
                            // console.log("Thats nested bro push that rizz in", item)

                            // If this has nested properties, have to recursively call
                            instructions.push(...instructionsArr(item, currentDepth+1))
                        }
                        
                    }
                    // NOTE: is this even working?
                    else if (Object.hasOwn(item, "depthOccurances")){
                        // console.log("depthOccurances", item)
                    }
                })
            }
            // If looking through a single item
            else if (recipeTree.nested){
                // So.... I have to go through the nested property right? recursively
                const thatNestedThang = instructionsArr(recipeTree.nested, currentDepth)
                // console.log("nested thang", thatNestedThang)
                if (thatNestedThang.length > 0)
                {
                    // console.log("Push thatNestedThang")
                    // Nestedthang is an array so... flatten it
                    instructions.push(...thatNestedThang)
                }
                else{
                    // console.log("ayy lmao nothing in thatNestedThang")
                }
                
                //  Check if the recipe is in instructions already.
                //  NOTE: This looks like it might be hilariously unoptimized...
                // honestly hang on donn't bther checking if its already in the array of objects maybe do that afterwards at end of logic

                // Old block of code
                // if (instructions.includes(item =>
                //     item.name === recipeTree.name
                // ))
                // {
                //     //  push current depth to depth occurances to keep track
                //     instructions.find(obj => obj.name === recipeTree.name).depthOccurances.push(currentDepth)
                // }
                // //  Not existing
                // else{
                //     //  Push new objects to array
                //     instructions.push({
                //         name: recipeTree.name,
                //         // using this to find method cause recipe tree does not have method prop
                //         method: recipeTree.method ?? getMethodByName(recipeTree.name), 
                //         depthOccurances: [currentDepth],
                //     })
                // }

                // New block
                //  Push new objects to array
                instructions.push({
                    name: recipeTree.name,
                    // using this to find method cause recipe tree does not have method prop
                    method: recipeTree.method ?? getMethodByName(recipeTree.name), 
                    depthOccurances: [currentDepth],
                })
            }
        }
        // console.log("instructionsArr returning arr", instructions)
        // And if I recall correctly, this should flatten all ingredients into an array to be sorted later
        return instructions
    }

    //  Might be a better name for this
    //  Actually this could be global util...? Maybe...
    //  Anyway, this just consolidates the instructions array and groups items that have duplicate occurances
    function instructionsArrCompact(objectsArr){
        const compactArr = objectsArr.reduce((acc, curr) => {
            // console.log("comp", curr)
            const ingredientKey = acc.find(item => item.name === curr.name)

            if (ingredientKey){
                ingredientKey.depthOccurances.push(...curr.depthOccurances)
            }
            else{   
                //  NOTE: Maybe be careful with push(curr) its technically pushing by reference and not by value
                acc.push(curr)
            }

            return acc

        }, [])

        return compactArr
    }

    //  Just goes through array and removes items that were refered to as purchase
    function removePurchasedItemsInInstructions(objectsArr){
        console.log("before remove", objectsArr)
        const removedPurchasedArr = objectsArr.filter(obj => getReferToRecipeByName(obj.name) !== "purchase")
        console.log("removed", removedPurchasedArr)
        return removedPurchasedArr
    }

    //  Sorts descending order
    function instSortHighestDepth(objectsArr){
        const sortedArr = objectsArr.sort((a, b) => Math.max(...b.depthOccurances) - Math.max(...a.depthOccurances) )
        // console.log("get sorted", sortedArr)
        return sortedArr
    }
    //umm.... we are just gonna use the recipe tree as parameter
    function getCookingInstructionsByRecipeTree(recipeTree){
        const rawInstructionsArr = instructionsArr(recipeTree)
        // Remove purchased items from the instructions
        const removePurchasedItemsArr = removePurchasedItemsInInstructions(rawInstructionsArr)
        const compactInstructionsArr = instructionsArrCompact(removePurchasedItemsArr)
        const sortedInstructionsArr = instSortHighestDepth(compactInstructionsArr)

        return sortedInstructionsArr
    }

    
    function renderCookingInstructions(recipeTree){
        const instructionsArr = getCookingInstructionsByRecipeTree(recipeTree)

        if (instructionsArr.length === 0)
        {
            // console.log("ayy mate you sending NOTHIN haha")
            return null
        }

        const content = instructionsArr.map(({name, method, depthOccurances}) => {
            return <li>{method} {depthOccurances.length} <ClickableItemText>{name}</ClickableItemText></li>
        })

        return (
            <div className='cooking-instructions'>
                <h2>Cooking Instructions</h2>
                <p className="italic">*note: non-cooking skill methods like milling/gathering/purchase are not supported yet</p>
                <h3>{mainItem?.name}</h3>
                <p>Grab all base ingredients before starting</p>
                
                <p>Steps:</p>
                <ol>
                    {content}
                </ol>
                {/* <p>{mainItem.name} MY MAN</p> */}
            </div>
        )
    }



    return (
        <div className="cooking-page">
            <div className="container">
                <h2>Under construction, some features may be limited or broken</h2>
                <div className="cooking-search-options">
                    <p>Search Options</p>

                    <input type="checkbox" id="by-name" name="by-name" value={byNameIsChecked} checked={byNameIsChecked} onChange={handleOnChange}/>
                    <label htmlFor="by-name">By name</label>
                    <input type="checkbox" id="by-ingredient" name="by-ingredient" value={byIngredientIsChecked} checked={byIngredientIsChecked} onChange={handleOnChangeByIngredient}/>
                    <label htmlFor="by-ingredient">By ingredient</label>

                </div>

                <div className="cooking-item-search">
                    <label htmlFor="item-search">Item Search</label>
                    <input 
                        type="text" 
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)} 
                        id="item-search" 
                        value={itemSearch} 
                        onChange={(e) => handleSearchInput(e.target.value)}
                    />

                    <SearchList 
                        searchInput={itemSearch} 
                        byNameIsChecked={byNameIsChecked}
                        byIngredientIsChecked={byIngredientIsChecked}
                    />
                </div>

                {renderMainDish(mainItem)}

                {renderSelectedItem()}

                {/* {console.log("Here is the full tree",recipeTree)} */}
                {recipeTree && renderBaseIngredients((countBaseIngredients(getBaseIngredientsFromRecipeTree(recipeTree))))}

                {renderCookingInstructions(recipeTree)}

                {renderIngredientTree(recipeTree)}

                {/* {getBaseIngredientsFromRecipeTree(recipeTree)} */}
                
            </div>
        </div>
    )
}