cmake_minimum_required(VERSION 3.22.1)

project("ShapeBeats")

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Enable 16 KB memory page size support
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fPIC")

# Add React Native libraries
add_library(reactnative SHARED IMPORTED)
set_target_properties(reactnative PROPERTIES IMPORTED_LOCATION ${REACT_NATIVE_DIR}/android/app/build/intermediates/library_jni/debug/jni/${ANDROID_ABI}/libreactnativejni.so)

# Add Hermes if enabled
if(HERMES_ENABLED)
    add_library(hermes SHARED IMPORTED)
    set_target_properties(hermes PROPERTIES IMPORTED_LOCATION ${REACT_NATIVE_DIR}/android/app/build/intermediates/library_jni/debug/jni/${ANDROID_ABI}/libhermes.so)
endif()

# Configure for 16 KB memory page size support
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -DANDROID_STL=c++_shared")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -DANDROID_PAGE_SIZE_AGNOSTIC=1")
