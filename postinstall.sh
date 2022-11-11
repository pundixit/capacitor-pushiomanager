#!/bin/sh

echo "checking for PushIOManager.xcframework for iOS integration"

if [ ! -f "/frameworks/PushIOManager.xcframework" ]; then
        echo "Found /frameworks/PushIOManager.xcframework. run npx cap sync ios"
else
        echo "\n\n\n Error ==> PushIOManager.xcframework not found. Please copy the PushIOManager.xcframework to Plugin_Patg/frameworks/ and install package again. Follow README.md Installation instructions.<===  \n\n\n;"
    exit 1;
fi

