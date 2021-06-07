<?php

namespace App\Controllers;

class Home extends BaseController
{
	public function index()
	{
		return view('welcome_message');
	}

	/**
	 * Upload a PDF an convert to image
	 * 
	 * @return JSON
	 */
	public function upload() 
	{

		$files = $this->request->getFiles();
		$path = $this->request->getFile('file')->store();
		
		$generateName =  ROOTPATH."public/temps/one";
		
		// converting pdf to images with imagick
		$im = new \Imagick(WRITEPATH."uploads/".$path);
		$im->setResolution(160,220);

		$pages = $im->getNumberImages();
		
		$im->writeImages($generateName.".jpeg", true);
		
		//Return the image
		$data = [
			'success' => true,
			'images' => $this->_getImagePdfPath($pages, $generateName)
		];

		return $this->response->setJSON($data);


	}

	/**
	 * Get all path images generate by imagick
	 * 
	 * @param Int $totalImage	Total Image
	 * 
	 * @return Array
	 */
	private function _getImagePdfPath($total)
	{
		$paths = [];
		$fileName = "temps/one";
		
		if ($total <= 1) {
			$paths[0] = $fileName.".jpeg";
		} else {
			for($i= 0; $i< $total; $i++) {
				$paths[] = $fileName . "-". $i .".jpeg";  
			}
		}
		return $paths; 
	}
	/**
	 * Save all the label and crop the image by the layer size
	 */
	public function save()
	{
		helper('text');
		$request = $this->request->getPost();
		$code = random_string();
		$this->_slicing($request);

		$data = [
			'code' => $code
		];
		return $this->response->setJSON($data);

	}

	/**
	 * Show the slicing result
	 * 
	 *
	 */  
	public function success($code)
	{
		return view('success');
	}


	/**
	 * Slicing the image and save to database
	 * 
	 * @param Array	$layers Selection layers
	 * @param String $code Unique code 
	 * 
	 * @return Void
	 */
	private function _slicing($layers, $code) 
	{
		$slicingModel = new \App\Models\SlicingModel();
		foreach($layers as $layer) {
			$image = new \Imagick(ROOTPATH."public/".$layer->source);
			foreach($layer->rectangle as $rec) {
				$file_name = $rec->name;
				$mode = 
				$image->cropImage( $rec->width , $rec->height , $rec->x , $rec->y);
				$thumb->writeImage($destinationPath.'/'.$fileName);

				$data = [];
				$slicingModel->insert($data);
			}
		}		
	}

		
}
