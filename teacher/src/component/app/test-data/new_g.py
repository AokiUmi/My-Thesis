import random
import numpy as np
from matplotlib import pyplot as plt
import json

LENGTH= 6221
def pauselist():
    array = np.zeros(LENGTH)
    for i in range(30):
        i = random.randint(2, LENGTH -1)
        array[i] = random.randint(1, 3)
        if random.random() > 0.2:
            array[i - 30: i + 30] = random.randint(1, 4)
    arr_list = [{'x': i, 'y': val} for i, val in enumerate(array)]
    return arr_list

def commentlist():
    array = np.zeros(LENGTH)
    for i in range(12):
        i = random.randint(2, LENGTH -1)
        array[i] = random.randint(1, 3)
        if random.random() > 0.2:
            array[i - 30: i + 30] = random.randint(1, 3)
    arr_list = [{'x': i, 'y': val} for i, val in enumerate(array)]
    return arr_list

def timelist():
    arr = np.zeros(LENGTH)
    value = 20
    for i in range(LENGTH):
        if random.random() > 0.99:
            value = value + random.randint(0, 4) - 2
            if value < 0:
                value = 3
        arr[i] = value

    arr_list = [{'x': i, 'y': val} for i, val in enumerate(arr)]
    return arr_list

def speedlist():
    arr = np.zeros(LENGTH)
    value = 1
    for i in range(LENGTH):
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

    arr_list = [{'x': i, 'y': val} for i, val in enumerate(arr)]
    return arr_list
        
if __name__ == '__main__':
    timelist = timelist()
    # pauselist = pauselist()
    # commentlist= commentlist()
    # speedlist= speedlist()
        # Write the list to a file

    with open("test_timelist.json", "w") as f:
        json.dump({"timelist": timelist}, f)   
    # with open("test_commentlist.json", "w") as f:
    #     json.dump({"commentlist": commentlist}, f)

    # with open("test_pauselist.json", "w") as f:
    #     json.dump({"pauselist": pauselist}, f)

    # with open("test_speedlist.json", "w") as f:
    #     json.dump({"speedlist": speedlist}, f)

    print("Data written to test_commentlist_smooth.json")
        