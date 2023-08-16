import unittest

import numpy as np
from templator import get_length


class TestSample(unittest.TestCase):
    def test_type(self):
        a = get_length(np.array([1, 2]))
        self.assertTrue(type(a) == np.float_)
