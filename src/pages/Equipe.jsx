
import React from 'react';
import Navbar from '../componenets/navbar';
import Footer from '../componenets/footer';

const Equipe = () => {
  return (
    <div>
      <Navbar />
      <div class="font-[sans-serif] bg-gradient-to-tr from-customPurple via-orange-100 to-buttonColor3 p-6">
            <div class="max-w-5xl max-md:max-w-xl mx-auto">
                <h2 class="text-3xl text-center font-extrabold">Meet Our Professional Team</h2>

                <div class="grid md:grid-cols-2 gap-8 max-sm:justify-center text-center mt-16">
                    <div>
                        <img src="https://readymadeui.com/team-1.webp" class="w-40 h-40 rounded-full inline-block" />
                        <div class="bg-white p-4 rounded-lg relative -mt-6">
                            <h4 class="text-gray-800 text-lg font-bold">John Doe</h4>
                            <p class="text-sm text-gray-800 mt-1">Software Engineer</p>
                            <p class="mt-4 text-gray-600 text-sm">Veniam proident aute magna anim excepteur et ex consectetur velit ullamco veniam minim aute sit. Ullamco nisi enim ipsum irure laboris ad ut. Esse cupidatat deserunt magna aute.</p>
                        </div>
                    </div>

                    <div>
                        <img src="https://readymadeui.com/team-2.webp" class="w-40 h-40 rounded-full inline-block" />
                        <div class="bg-white p-4 rounded-lg relative -mt-6">
                            <h4 class="text-gray-800 text-lg font-bold">Mark Adair</h4>
                            <p class="text-sm text-gray-800 mt-1">Software Engineer</p>
                            <p class="mt-4 text-gray-600 text-sm">Veniam proident aute magna anim excepteur et ex consectetur velit ullamco veniam minim aute sit. Ullamco nisi enim ipsum irure laboris ad ut. Esse cupidatat deserunt magna aute.</p>
                        </div>
                    </div>

                    <div>
                        <img src="https://readymadeui.com/team-3.webp" class="w-40 h-40 rounded-full inline-block" />
                        <div class="bg-white p-4 rounded-lg relative -mt-6">
                            <h4 class="text-gray-800 text-lg font-bold">Simon Konecki</h4>
                            <p class="text-sm text-gray-800 mt-1">Web Designer</p>
                            <p class="mt-4 text-gray-600 text-sm">Veniam proident aute magna anim excepteur et ex consectetur velit ullamco veniam minim aute sit. Ullamco nisi enim ipsum irure laboris ad ut. Esse cupidatat deserunt magna aute.</p>
                        </div>
                    </div>

                    <div>
                        <img src="https://readymadeui.com/team-6.webp" class="w-40 h-40 rounded-full inline-block" />
                        <div class="bg-white p-4 rounded-lg relative -mt-6">
                            <h4 class="text-gray-800 text-lg font-bold">Eleanor</h4>
                            <p class="text-sm text-gray-800 mt-1">Web Designer</p>
                            <p class="mt-4 text-gray-600 text-sm">Veniam proident aute magna anim excepteur et ex consectetur velit ullamco veniam minim aute sit. Ullamco nisi enim ipsum irure laboris ad ut. Esse cupidatat deserunt magna aute.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      <Footer />
    </div>
  );
};

export default Equipe;
