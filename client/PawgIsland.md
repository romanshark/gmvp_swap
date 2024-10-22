🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑
PAWG ISLAND
🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑



🍑WHITELIST🍑
To whitelist a token, you simply need to upload the token image in png form and store it in 
public/images/tokens. Then you need to add in the relevant data into pancake-default.tokenlist.json, which is 
found in config/constants/tokenLists/pancake-default.tokenlist.json 

It is helpful to push the png file first, and then do the subsequent work with the tokenlist. 
you can key in the image url by using the same routing logic, and ensuring that the token address 
is appropriately modified for the new token. it is helpful to do it this way (hardcoding the image url) 
because then you know that the token image is properly being loaded into the fe. 

To whitelist a token, you do not need to do any additional work with tokens.ts or token-info.ts 
Those files only come into play when/if you are adding a farm and using an LP address. 



🍑SORTING OF WHITELIST🍑 

The sorting of the token lists is now managed via sorting.ts (src/components/SearchModal.ts)
There is alphabetizing which occurs there (Meme City does not utilize this fyi) 
But there is additional logic which can force certain tokens to populate on that list before any others
To 'pin' a token to the top of that list, simply add it to the array in sorting.ts 


🍑 ADDING FARMS AND DEALING WITH TOKENS.TS AND TOKEN-INFO.TS 🍑
When adding a farm, if the farm is not already in the OG Masterchef, then you must add it to the filtered farm config. 
If you dont, it will prevent the staking pools from correctly gathering the aprs. 
The filtered farm config is found in state/pools/index.ts filteredFarmConfig 
must also set classic: true


