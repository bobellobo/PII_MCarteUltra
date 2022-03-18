import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Home} from "~/screens/Home";
import {CreatePartieLocal} from "~/screens/CreatePartieLocal";
import{PartieLocal} from "~/screens/PartieLocal/PartieLocal";

export type RouteParams = {
    Home:undefined,
    Create :undefined,
    Join :undefined,
    Game :undefined,   
    Lobby : undefined,
    CreatePartieLocal:undefined,
    PartieLocal : {
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
                name="CreatePartieLocal"
                component={CreatePartieLocal}
                options={{
                    animation:"slide_from_right",
                    title :'Nouvelle partie',
                    headerShown:false,
                }}
            />

            <Stack.Screen 
            name="PartieLocal"
            component={PartieLocal}
            options ={{headerShown:false}}
            />

        </Stack.Group>
        
    </Stack.Navigator>
    );
};