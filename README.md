# Adventure on Fruit Island

## How to Run

#### The Super Fast Way
- Download `Expo` app on your phone (ios/android).
- Run the program using [this link](https://exp.host/@seandkim/fruit_island_expo). 

#### The Fast way
- Clone the repository
- Run `npm install`.
- Run `npm start` or open the folder using [Expo XDE](https://expo.io/tools).

This is created with [create-react-native-app](https://facebook.github.io/react-native/blog/2017/03/13/introducing-create-react-native-app.html). If you have any trouble running `npm start`, checkout their docs or git repository.  

## Problems that needs to be fixed / discussed
- Add more stages.
- Can apple be reached in the middle of running commands or just at the end?
- Orientation Bug: open camera => change to portrait => go back to game => game is now in portrait not landscape.
- Accessibility feature and voice-assistant from Expo SDK overlap each other.
- Make rotation sound symmetrical.
- Animate rotation.
- Play audio synchronously? If not, there might be overlap when you play long audio.
- General structure change (use more redux)
