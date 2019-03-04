import unittest
import requests


class endpointTest(unittest.TestCase):
    def test_something(self):
        r = requests.post('http://localhost:5000/join', json = {'name' : 'ken'})
        r = requests.post('http://localhost:5000/leave', json = {'name' : 'ken'})
        r = requests.get('http://localhost:5000/player')
        playerNum = requests.get('http://localhost:5000/player')
        self.assertEqual(playerNum,'4')


if __name__ == '__main__':
    unittest.main()