import {ingredientsData} from './cookingdata.js'
import {
    getCookingRankByMethod,
    getIngredientObjByName,
    getMethodByName
        } from './cookingUtils.js'

import SearchList from './components/SearchList.jsx'

import './Cooking.css'

import React, { useState } from "react"

export default function Cooking(){

    const [byNameIsChecked, setByNameIsChecked] = React.useState(true)
    const [byIngredientIsChecked, setByIngredientIsChecked] = React.useState(false)

    const [itemSearch, setItemSearch] = React.useState("")
    const [searchIsFocused, setSearchFocused] = useState(false)

    const [mainItem, setMainItem] = React.useState(null)
    const [recipeTree, setRecipeTree] = React.useState()

    React.useEffect(() => {
        function handleClick(event){
            //  If user clicked on item in ItemSearch List
            if (event.target.classList.contains('cooking-item-search-name')){
                console.log("Clicked item in list")
                handleItemSearchClick(event.target.dataset.name)
            }
            else if (event.target.dataset.name){

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

    function handleItemSearchClick(itemName){
        const itemObj = getIngredientObjByName(itemName)
        setMainItem(itemObj)

        // I suppose when you set a main item I should set everything to use recipe1 by default
        // I need to be able to go through the nested recipes and save that in state
        setRecipeTree(getRecipeTree(itemObj))
    }

    function getRecipeTree(itemObj, selected = "recipe1"){
        const recipe = {}
        // if recipe property exists
        if (itemObj?.recipe){
            // Check for instances of other recipes
            
            let recipeCounter = 0
            recipe["name"] = itemObj.name
            recipe["selected"] = selected

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

            if (itemObj.recipe[selected]){
                for (const ingredient of itemObj.recipe[selected]){
                    // console.log("this ingredient", ingredient)
                    const ingrObj = ingredientsData.find(item => {
                        return item.name === ingredient.name
                    })

                    // console.log("Found Item", ingredient.name, ingrObj, )
                    //if this item has recipe property

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
                        //  Just throw the ingredient name in there lmao
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
        else{ //    If object doesn't have recipe property
            // console.log(`Item does not have recipe property: `, itemObj)
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

            return <div className="cooking-main-item-content">
                <h2>Main Item</h2>
                {item.name ? <h3>{item.name}</h3> : <h2>Undefined Item Name</h2>}
                {item.method ? <p>{`${item.method} (${getCookingRankByMethod(item.method)} Cooking)`}</p> : null}
                {Object.keys(item.recipe ?? {}).length > 1 ? <p>This item has multiple known recipes</p> : null}
                {item.recipe ? renderMainRecipe(): null}
            </div>
        }
        else{
            return null
        }
    }

    function renderMainRecipe()
    {
        if (mainItem && recipeTree){
            //Uhh so I need to get the recipe tree
            const items = mainItem.recipe[recipeTree.selected]
            console.log("Render this", items)
            // Might be possible for something to break here if the item returned has no name/percent
            return <div>
                <p>Main Ingredients</p>
                <ul>
                    {items.map(item => <li>{item.name} ({item.percent}%)</li>)}
                </ul>
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
                        <span>{getMethodByName(item.name)}</span>
                        <p>{item.name}</p>
                        {renderIngredientTree(item.nested)}
                    </li>
                ))}</ul>
            }
            else
            {
                return <div className='recipe-tree'>
                    <h2 className="recipe-tree-title">Recipe Tree</h2>
                    <span>{getIngredientObjByName(recipeTree?.name).method}</span>
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
                // console.log("F2 Nested property exists")
                // console.log("Checking Nested Property")
                //  recursively go through that nested property
                const something2 = getBaseIngredientsFromRecipeTree(recipeTree.nested)
                // console.log("F2 something2", something2)
                //push it all to ingredients arr
                ingredientsArr.push(...something2)
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
            elements.push(<li>{`${quantity}x ${item}`}</li>)
        }
        
        const finalElement = <div className='cooking-base-ingredients'>
            <h2>Base Ingredients</h2>
            <ul>{elements}</ul></div>

        return finalElement
    }

    //  Go through an object's recipe tree and return an array of objects to use later
    function instructionsArr(recipeTree, currentDepth = 0){
        const instructions = []

        console.log("depth:", currentDepth, "Calling instructionsArr", recipeTree)

        //  If looking through a Recipe Tree
        if (recipeTree)
        {
            //If looking through an array
            if (Array.isArray(recipeTree)){
                //  Encountering a problem
                
                
                //go through array and
                //tf do I do uhh 
                const something1 = recipeTree.map(item => {
                    console.log("something1", item)
                    //  I need to be able to tell the difference between a recipeTree.nested and an instructionsArr
                    if (Object.hasOwn(item, "hasMultiple")){
                        console.log("recipeTree.nested", item)
                        if (item.nested){
                            console.log("Thats nested bro push that rizz in", item)
                            // If this has nested properties need to push instructions
                            // instructions.push({
                            //     name: item.name,
                            //     push: item.method ?? getMethodByName(item.name),
                            //     depthOccurances: [currentDepth+1]
                            // })

                            //Ok so I HAVE to recursively go through from here
                            //do i just... call it on the item?
                            console.log("I need to do something recursive here")
                            instructions.push(...instructionsArr(item, currentDepth+1))
                        }
                        
                    }
                    // NOTE: is this even working?
                    else if (Object.hasOwn(item, "depthOccurances")){
                        console.log("depthOccurances", item)
                    }
                    
                })
            }
            else if (recipeTree.nested){

                // So.... I have to go through the nested property right? recursively
                const thatNestedThang = instructionsArr(recipeTree.nested, currentDepth)
                console.log("nested thang", thatNestedThang)
                if (thatNestedThang.length > 0)
                {
                    console.log("Push thatNestedThang")
                    // Nestedthang is an array so... flatten it
                    instructions.push(...thatNestedThang)
                }
                else{
                    console.log("ayy lmao nothing in thatNestedThang")
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
        console.log("returning arr", instructions)
        return instructions
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
                        searchIsFocused={searchIsFocused}
                        byNameIsChecked={byNameIsChecked}
                    />
                </div>

                {renderMainDish(mainItem)}

                {/* {console.log("Here is the full tree",recipeTree)} */}
                {recipeTree && renderBaseIngredients((countBaseIngredients(getBaseIngredientsFromRecipeTree(recipeTree))))}

                {renderIngredientTree(recipeTree)}

                {/* {getBaseIngredientsFromRecipeTree(recipeTree)} */}
                {console.log(instructionsArr(recipeTree))}
            </div>
        </div>
    )
}