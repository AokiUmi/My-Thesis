import random
import numpy as np
from matplotlib import pyplot as plt
import json

def pauselist():
    array = np.zeros(6221)
    for i in range(30):
        i = random.randint(2, 6220)
        array[i] = random.randint(1, 3)
        if random.random() > 0.2:
            array[i - 30: i + 30] = random.randint(1, 4)
    arr_list = [{'x': i, 'y': val} for i, val in enumerate(array)]
    return arr_list

def commentlist():
    array = np.zeros(6221)
    for i in range(12):
        i = random.randint(2, 6220)
        array[i] = random.randint(1, 3)
        if random.random() > 0.2:
            array[i - 30: i + 30] = random.randint(1, 3)
    arr_list = [{'x': i, 'y': val} for i, val in enumerate(array)]
    return arr_list

def timelist():
    arr = np.zeros(6221)
    value = 20
    for i in range(6221):
        if random.random() > 0.99:
            value = value + random.randint(0, 4) - 2
            if value < 0:
                value = 3
        arr[i] = value

    arr_list = [{'x': i, 'y': val} for i, val in enumerate(arr)]
    return arr_list

def speedlist():
    arr = np.zeros(6221)
    value = 1
    for i in range(6221):
        if random.random() > 0.994:
            value = value + random.random() - 0.5
            if value < 0.5:
                value = 0.5
            elif value > 2:
                value = 2
            value += (1 - value) * random.random()
        arr[i] = value

    window_size = 100
    for i in range(len(arr) - 100):
        arr[i] = np.mean(arr[i:i + window_size])
        
if __name__ == '__main__':
    pauselist = pauselist()
    commentlist= commentlist()
        # Write the list to a file
    with open("test_commentlist.json", "w") as f:
        json.dump({"commentlist": commentlist}, f)

    with open("test_pauselist.json", "w") as f:
        json.dump({"pauselist": pauselist}, f)

    print("Data written to test_commentlist_smooth.json")
        