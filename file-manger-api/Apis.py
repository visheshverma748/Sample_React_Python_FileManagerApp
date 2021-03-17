import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask import send_from_directory
import mimetypes
from zipfile import ZipFile
import shutil

app = Flask(__name__) 
CORS(app)

folderName = 'file-system'


def get_all_file_paths(directory): 
    file_paths = [] 
    for root, directories, files in os.walk(directory): 
        for filename in files: 
            filepath = os.path.join(root, filename) 
            file_paths.append(filepath) 
    return file_paths



@app.route('/files', methods = ['GET']) 
def files(): 
	data=[]
	try:
		filePath=''
		queryPath = request.args.get('path')
		if(queryPath=="/"):
			filePath = folderName+queryPath
		else:
			filePath = folderName+queryPath+"/"

		for file in os.listdir(filePath):
			if os.path.isfile(filePath+file):
				data.append({'name':file,'description':'some description','type':'file'})
			else:
				data.append({'name':file,'description':'some description','type':'folder'})
	except:
		data:[]
	return jsonify({'data': data}) 


@app.route('/createfile', methods=['POST'])
def create_file():
	try:
		data = request.get_json()
		filePath=''
		pathName=data['pathname']
		folder=data['foldername']

		if(pathName=="/"):
			filePath = folderName+pathName
		else:
			filePath = folderName+pathName+"/"

		dirName = filePath+folder
		if not os.path.exists(dirName):
			os.makedirs(dirName)
			return jsonify({'msg':'success' }) 
		else:    
			return jsonify({'msg': 'error'})
	except:
		return jsonify({'msg': 'error'})


@app.route('/upload', methods=['POST'])
def upload():
	try:
		uploaded_files = request.files.getlist("files")
		pathName = request.form.get("pathname")
		filePath = folderName+pathName
		for file in uploaded_files:
			file.save(os.path.join(filePath, file.filename))
		return jsonify({'msg':'success' })
	except:
		return jsonify({'msg':'error'})



@app.route('/downloadfile',methods = ['GET'])
def downLoadFile():
	try:
		queryPath = request.args.get('path')
		filename = request.args.get('filename')
		dirpath=''
		if(queryPath=="/"):
			dirpath = folderName+queryPath
		else:
			dirpath = folderName+queryPath+"/"

		filemimeType = mimetypes.guess_type(dirpath+filename)[0]
		return send_from_directory(
			dirpath, filename,
			as_attachment=True, 
			mimetype=filemimeType,
			attachment_filename=filename
		)
	except:
		return jsonify({'msg':'error'})


@app.route('/downloadfolder',methods=['GET'])
def downloadFolder():
	try:
		queryPath = request.args.get('path')
		fldname = request.args.get('fldname')
		directory=''

		if(queryPath=="/"):
			directory = folderName+queryPath+fldname
		else:
			directory = folderName+queryPath+"/"+fldname

		file_paths = get_all_file_paths(directory)
		with ZipFile('temp.zip','w') as zip: 
			for file in file_paths: 
				zip.write(file)

		return send_from_directory(
			"./", 
			'temp.zip', 
			as_attachment=True, 
			mimetype='application/zip', 
			attachment_filename='temp.zip'
		)
	except:
		return jsonify({'msg':'error'})


@app.route('/deletefile',methods=['GET'])
def deletefile():
	try:
		queryPath = request.args.get('path')
		filename = request.args.get('filename')
		file=''
		if(queryPath=="/"):
			file = folderName+queryPath+filename
		else:
			file = folderName+queryPath+"/"+filename
		os.remove(file)
		return jsonify({'msg':'sucsess'})
	except:
		return jsonify({'msg':'error'})


@app.route('/deletefolder',methods=['GET'])
def deletefolder():
	try:
		queryPath = request.args.get('path')
		fldname = request.args.get('fldname')
		folder=''
		if(queryPath=="/"):
			folder = folderName+queryPath+fldname
		else:
			folder = folderName+queryPath+"/"+fldname

		shutil.rmtree(folder)
		return jsonify({'msg':'sucsess'})
	except:
		return jsonify({'msg':'error'})



# driver function 
if __name__ == '__main__':
	app.run(debug = True) 
