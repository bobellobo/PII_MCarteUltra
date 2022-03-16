import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Home} from "~/screens/Home";
import {CreatePartie} from "~/screens/CreatePartie/CreatePartie";
import{Partie} from "~/screens/Partie";

export type RouteParams = {
    Home:undefined,
    CreatePartie:undefined,
    Partie : {
        playerList : string[];
    };
}

const Stack = createNativeStackNavigator<RouteParams>();

export const RootNavigator = () => {
    return (
    <Stack.Navigator>

        <Stack.Group>

            <Stack.Screen 
            name="Home" 
            component={Home}
            options={{
                headerShown :false
            }}
            />
            <Stack.Screen 
                name="CreatePartie"
                component={CreatePartie}
                options={{
                    animation:"slide_from_right",
                    title :'Nouvelle partie',
                    headerShown:false,
                }}
            />

            <Stack.Screen 
            name="Partie"
            component={Partie}
            options ={{headerShown:false}}
            />

        </Stack.Group>
        
    </Stack.Navigator>
    );
};